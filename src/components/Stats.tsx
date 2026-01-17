import { useTranslation } from "react-i18next";

const statValues = ["50,000+", "24h", "98%", "200+"];
const statKeys = ["patients", "responseTime", "satisfaction", "dermatologists"];

const Stats = () => {
  const { t } = useTranslation("home");

  return (
    <section className="py-16 md:py-20 gradient-trust">
      <div className="container">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
          {statKeys.map((key, index) => (
            <div key={key} className="text-center">
              <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary mb-2">
                {statValues[index]}
              </div>
              <div className="text-sm md:text-base text-muted-foreground font-medium">
                {t(`stats.${key}`)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
