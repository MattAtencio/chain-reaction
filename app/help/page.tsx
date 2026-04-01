import Link from "next/link";

export default function HelpPage() {
  return (
    <main className="min-h-dvh p-6 max-w-lg mx-auto safe-area-padding">
      <Link
        href="/"
        className="text-accent-primary hover:underline text-sm mb-6 inline-block"
      >
        &larr; Back to Game
      </Link>

      <h1 className="text-3xl font-bold text-text-primary mb-6">
        How to Play
      </h1>

      <div className="space-y-6 text-text-secondary">
        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-2">
            Objective
          </h2>
          <p>
            Place orbs on the grid to trigger chain reactions. In versus modes,
            eliminate all of your opponent&apos;s orbs. In the daily puzzle, clear the
            entire board within the move limit.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-2">
            Basic Rules
          </h2>
          <ul className="list-disc list-inside space-y-2">
            <li>
              Tap any empty cell or a cell you own to place an orb of your color.
            </li>
            <li>
              Each cell has a <strong className="text-text-primary">critical mass</strong> based on
              its position:
            </li>
            <ul className="list-none ml-6 space-y-1 mt-1">
              <li>
                <span className="text-accent-primary">Corner cells:</span> 2 orbs
              </li>
              <li>
                <span className="text-accent-primary">Edge cells:</span> 3 orbs
              </li>
              <li>
                <span className="text-accent-primary">Center cells:</span> 4 orbs
              </li>
            </ul>
            <li>
              When a cell reaches its critical mass, it <strong className="text-text-primary">explodes</strong>:
              it resets to 0 and sends 1 orb to each adjacent cell (up, down, left, right).
            </li>
            <li>
              Orbs sent to neighboring cells become <strong className="text-text-primary">your color</strong>,
              capturing them from your opponent.
            </li>
            <li>
              If a neighbor also reaches critical mass, it explodes too &mdash;
              creating a <strong className="text-accent-primary">chain reaction</strong>!
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-2">
            Game Modes
          </h2>
          <ul className="space-y-3">
            <li>
              <strong className="text-text-primary">Solo Practice</strong> &mdash;
              Play against a simple AI on a 6&times;6 grid. Great for learning the mechanics.
            </li>
            <li>
              <strong className="text-text-primary">Local 2-Player</strong> &mdash;
              Two players take turns on the same device with an 8&times;8 grid.
            </li>
            <li>
              <strong className="text-text-primary">Daily Puzzle</strong> &mdash;
              A new seeded puzzle each day. Clear all orbs from the board in the
              given number of moves.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-text-primary mb-2">
            Strategy Tips
          </h2>
          <ul className="list-disc list-inside space-y-2">
            <li>
              Corner cells explode with just 2 orbs &mdash; they are powerful
              chain reaction starters.
            </li>
            <li>
              Build up cells near critical mass to set up devastating chains.
            </li>
            <li>
              Watch for opponent cells near critical mass &mdash; capturing them
              with an explosion can swing the game.
            </li>
            <li>
              In the daily puzzle, plan your explosions to cascade and clear
              the entire board.
            </li>
          </ul>
        </section>
      </div>
    </main>
  );
}
