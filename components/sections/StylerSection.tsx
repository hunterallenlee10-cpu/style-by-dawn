import { Styler } from '../Styler/Styler';

export function StylerSection() {
  return (
    <section id="styler" aria-labelledby="styler-title" className="section">
      <div className="wrap">
        <Styler
          header={
            <>
              <p className="eyebrow text-green">Shop by occasion</p>
              <h2 id="styler-title" className="mt-3 text-h2">Where are you headed?</h2>
              <p className="mt-4 text-lead text-barnwood">Pick the plan. Dawn already put the outfit together.</p>
            </>
          }
        />
      </div>
    </section>
  );
}
