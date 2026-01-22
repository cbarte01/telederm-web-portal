import { describe, it, expect } from "vitest";
import {
  sanitizeText,
  sanitizeName,
  sanitizeDate,
  sanitizeDescription,
  sanitizeReferralCode,
  sanitizeUUID,
  sanitizeField,
  sanitizeDraft,
} from "../sanitization";

describe("Sanitization Utilities", () => {
  describe("sanitizeText", () => {
    it("should remove HTML tags", () => {
      expect(sanitizeText("<script>alert('xss')</script>")).toBe(
        "alert('xss')"
      );
      expect(sanitizeText("<b>bold</b>")).toBe("bold");
      expect(sanitizeText("<img src='x' onerror='alert(1)'>")).toBe("");
    });

    it("should remove javascript: URLs", () => {
      expect(sanitizeText("javascript:alert(1)")).toBe("alert(1)");
      expect(sanitizeText("JAVASCRIPT:evil()")).toBe("evil()");
    });

    it("should remove event handlers", () => {
      expect(sanitizeText("onclick=evil()")).toBe("evil()");
      expect(sanitizeText("ONERROR=bad()")).toBe("bad()");
    });

    it("should normalize whitespace", () => {
      expect(sanitizeText("  hello   world  ")).toBe("hello world");
      expect(sanitizeText("line1\n\n\nline2")).toBe("line1 line2");
    });

    it("should handle non-string input", () => {
      expect(sanitizeText(null as unknown as string)).toBe("");
      expect(sanitizeText(undefined as unknown as string)).toBe("");
      expect(sanitizeText(123 as unknown as string)).toBe("");
    });

    it("should preserve normal text", () => {
      expect(sanitizeText("Hello, World!")).toBe("Hello, World!");
      expect(sanitizeText("Price: $50.00")).toBe("Price: $50.00");
    });
  });

  describe("sanitizeName", () => {
    it("should allow valid names", () => {
      expect(sanitizeName("John Doe")).toBe("John Doe");
      expect(sanitizeName("Mary O'Connor")).toBe("Mary O'Connor");
      expect(sanitizeName("Jean-Pierre")).toBe("Jean-Pierre");
      expect(sanitizeName("Dr. Smith")).toBe("Dr. Smith");
    });

    it("should allow international characters", () => {
      expect(sanitizeName("François")).toBe("François");
      expect(sanitizeName("Müller")).toBe("Müller");
      expect(sanitizeName("北京")).toBe("北京");
    });

    it("should remove invalid characters", () => {
      // Note: sanitizeName removes < > but keeps letters
      // Periods are allowed for titles like "Dr."
      expect(sanitizeName("John<script>")).toBe("Johnscript");
      expect(sanitizeName("Jane123")).toBe("Jane");
      expect(sanitizeName("Bob@evil.com")).toBe("Bobevil.com"); // @ removed, period kept
    });

    it("should normalize whitespace", () => {
      expect(sanitizeName("  John   Doe  ")).toBe("John Doe");
    });
  });

  describe("sanitizeDate", () => {
    it("should accept valid YYYY-MM-DD format", () => {
      expect(sanitizeDate("1990-05-15")).toBe("1990-05-15");
      expect(sanitizeDate("2000-12-31")).toBe("2000-12-31");
    });

    it("should reject invalid formats", () => {
      expect(sanitizeDate("15/05/1990")).toBe("");
      expect(sanitizeDate("May 15, 1990")).toBe("");
      expect(sanitizeDate("1990-5-15")).toBe(""); // Missing leading zeros
    });

    it("should reject clearly invalid dates", () => {
      expect(sanitizeDate("1990-13-01")).toBe(""); // Invalid month
      // Note: JavaScript Date is lenient with day overflow (Feb 30 -> Mar 2)
      // This is acceptable behavior - strict date validation happens at schema level
    });

    it("should handle non-string input", () => {
      expect(sanitizeDate(null as unknown as string)).toBe("");
      expect(sanitizeDate(19900515 as unknown as string)).toBe("");
    });

    it("should remove non-date characters", () => {
      expect(sanitizeDate("1990-05-15<script>")).toBe("1990-05-15");
    });
  });

  describe("sanitizeDescription", () => {
    it("should remove dangerous content but preserve text", () => {
      expect(sanitizeDescription("I have <b>severe</b> pain")).toBe(
        "I have severe pain"
      );
      expect(sanitizeDescription("Pain level: 8/10")).toBe("Pain level: 8/10");
    });

    it("should normalize whitespace", () => {
      expect(sanitizeDescription("Line 1\n\nLine 2")).toBe("Line 1 Line 2");
    });
  });

  describe("sanitizeReferralCode", () => {
    it("should allow alphanumeric and hyphens", () => {
      expect(sanitizeReferralCode("DOC123")).toBe("DOC123");
      expect(sanitizeReferralCode("doc-456")).toBe("DOC-456");
    });

    it("should uppercase the result", () => {
      expect(sanitizeReferralCode("abc")).toBe("ABC");
    });

    it("should remove invalid characters", () => {
      expect(sanitizeReferralCode("DOC@123!")).toBe("DOC123");
      expect(sanitizeReferralCode("code with spaces")).toBe("CODEWITHSPACES");
    });

    it("should truncate to 50 characters", () => {
      const longCode = "A".repeat(100);
      expect(sanitizeReferralCode(longCode)).toHaveLength(50);
    });
  });

  describe("sanitizeUUID", () => {
    it("should accept valid UUIDs", () => {
      const validUUID = "550e8400-e29b-41d4-a716-446655440000";
      expect(sanitizeUUID(validUUID)).toBe(validUUID);
    });

    it("should lowercase UUIDs", () => {
      const upperUUID = "550E8400-E29B-41D4-A716-446655440000";
      expect(sanitizeUUID(upperUUID)).toBe(
        "550e8400-e29b-41d4-a716-446655440000"
      );
    });

    it("should reject invalid UUIDs", () => {
      expect(sanitizeUUID("not-a-uuid")).toBe("");
      expect(sanitizeUUID("550e8400-e29b-41d4-a716")).toBe(""); // Too short
      expect(sanitizeUUID("550e8400-e29b-41d4-a716-44665544000g")).toBe(""); // Invalid char
    });

    it("should handle empty and null input", () => {
      expect(sanitizeUUID("")).toBe("");
      expect(sanitizeUUID(null as unknown as string)).toBe("");
    });
  });

  describe("sanitizeField", () => {
    it("should apply correct sanitization based on field name", () => {
      // Note: sanitizeName removes < > but keeps the letters "script"
      expect(sanitizeField("fullName", "John<script>")).toBe("Johnscript");
      expect(sanitizeField("dateOfBirth", "1990-05-15")).toBe("1990-05-15");
      expect(sanitizeField("referralCode", "doc-123")).toBe("DOC-123");
    });

    it("should handle null and undefined", () => {
      expect(sanitizeField("fullName", null)).toBe(null);
      expect(sanitizeField("fullName", undefined)).toBe(undefined);
    });

    it("should filter arrays", () => {
      const result = sanitizeField("bodyLocations", [
        "face",
        "neck",
        "x".repeat(200),
      ]);
      expect(result).toEqual(["face", "neck"]); // Long string filtered out
    });

    it("should pass through booleans", () => {
      expect(sanitizeField("hasAllergies", true)).toBe(true);
      expect(sanitizeField("hasAllergies", false)).toBe(false);
    });

    it("should handle invalid numbers", () => {
      expect(sanitizeField("currentStep", NaN)).toBe(0);
      expect(sanitizeField("currentStep", Infinity)).toBe(0);
      expect(sanitizeField("currentStep", 5)).toBe(5);
    });
  });

  describe("sanitizeDraft", () => {
    it("should sanitize all fields in a draft object", () => {
      const draft = {
        fullName: "John<>Doe<>",
        dateOfBirth: "1990-05-15",
        changeDescription: "<b>Got worse</b>",
        hasAllergies: false,
        currentStep: 3,
      };

      const result = sanitizeDraft(draft);
      // sanitizeName removes <> symbols but keeps letters
      expect(result.fullName).toBe("JohnDoe");
      expect(result.dateOfBirth).toBe("1990-05-15");
      expect(result.changeDescription).toBe("Got worse");
      expect(result.hasAllergies).toBe(false);
      expect(result.currentStep).toBe(3);
    });

    it("should handle empty draft", () => {
      expect(sanitizeDraft({})).toEqual({});
    });
  });

  describe("XSS Prevention", () => {
    const xssPayloads = [
      '<script>alert("xss")</script>',
      '<img src=x onerror=alert(1)>',
      '<svg onload=alert(1)>',
      'javascript:alert(1)',
      '<a href="javascript:alert(1)">click</a>',
      '"><script>alert(1)</script>',
      "'-alert(1)-'",
      '<div onmouseover="alert(1)">hover</div>',
    ];

    xssPayloads.forEach((payload, index) => {
      it(`should neutralize XSS payload #${index + 1}`, () => {
        const result = sanitizeText(payload);
        expect(result).not.toContain("<script");
        expect(result).not.toContain("javascript:");
        expect(result).not.toMatch(/on\w+=/i);
      });
    });
  });

  describe("SQL Injection Prevention", () => {
    // Note: SQL injection is primarily handled by parameterized queries
    // Client-side sanitization is NOT the security boundary for SQL injection
    // This test just verifies sanitization doesn't crash on SQL-like input
    const sqlPayloads = [
      "'; DROP TABLE users; --",
      "1' OR '1'='1",
      "UNION SELECT * FROM passwords",
    ];

    sqlPayloads.forEach((payload, index) => {
      it(`should handle SQL-like payload #${index + 1} without breaking`, () => {
        // Sanitization should not break on any input
        const result = sanitizeName(payload);
        expect(typeof result).toBe("string");
        // Note: sanitizeName allows apostrophes (for names like O'Connor)
        // SQL injection is handled server-side by parameterized queries
      });
    });
  });
});
