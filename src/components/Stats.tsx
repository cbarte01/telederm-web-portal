const stats = [
  { value: "50,000+", label: "Patients Helped" },
  { value: "24h", label: "Avg. Response Time" },
  { value: "98%", label: "Patient Satisfaction" },
  { value: "200+", label: "Certified Dermatologists" },
];

const Stats = () => {
  return (
    <section className="py-16 md:py-20 gradient-trust">
      <div className="container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-2">
                {stat.value}
              </div>
              <div className="text-sm md:text-base text-muted-foreground font-medium">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
