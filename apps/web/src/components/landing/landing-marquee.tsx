import { Star } from "lucide-react";

const ITEMS = [
  { text: "Frontend Architecture" },
  { text: "Design Systems" },
  { text: "Type-Safe by Default" },
  { text: "Pixel Perfect" },
  { text: "Built for Humans" },
  { text: "Seoul · Remote" },
];

const ALL = [...ITEMS, ...ITEMS];

export function LandingMarquee() {
  return (
    <div
      className="marquee"
      style={{ "--marquee-duration": "28s" } as React.CSSProperties}
    >
      <div className="marquee__track">
        {ALL.map((item, i) => (
          <div className="marquee__group" key={i}>
            <span>{item.text}</span>
            <Star size={18} className="marquee__star" />
          </div>
        ))}
      </div>
    </div>
  );
}
