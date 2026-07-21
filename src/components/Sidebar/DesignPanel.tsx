import { observer } from "mobx-react-lite";
import { useStores } from "../../hooks/useStores";
import "./DesignPanel.css";

const SECTIONS: { title: string; cards: { label: string; hint: string }[] }[] = [
  {
    title: "Design Elements",
    cards: [
      { label: "Engraving", hint: "Coming soon" },
      { label: "Etching", hint: "Coming soon" },
    ],
  },
  {
    title: "Uploads",
    cards: [{ label: "Add artwork", hint: "Coming soon" }],
  },
  {
    title: "Text",
    cards: [{ label: "Add inscription", hint: "Coming soon" }],
  },
];

/**
 * Display-only per the PRD: reserves the layout and validates the UX for a
 * future configurator, but contains no editing logic in this version.
 */
export const DesignPanel = observer(function DesignPanel() {
  const { designManager } = useStores();

  return (
    <aside className={`design-panel${designManager.isDesignPanelOpen ? "" : " is-collapsed"}`}>
      <button
        type="button"
        className="design-panel__toggle"
        onClick={() => designManager.toggleDesignPanel()}
        aria-expanded={designManager.isDesignPanelOpen}
        aria-label={designManager.isDesignPanelOpen ? "Collapse design panel" : "Expand design panel"}
      >
        {designManager.isDesignPanelOpen ? "\u203A" : "\u2039"}
      </button>

      <div className="design-panel__content">
        <p className="design-panel__eyebrow">Design</p>
        {SECTIONS.map((section) => (
          <section key={section.title} className="design-panel__section">
            <h2 className="design-panel__section-title">{section.title}</h2>
            <div className="design-panel__cards">
              {section.cards.map((card) => (
                <div className="design-panel__card" key={card.label}>
                  <span className="design-panel__card-label">{card.label}</span>
                  <span className="design-panel__card-hint">{card.hint}</span>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>
    </aside>
  );
});
