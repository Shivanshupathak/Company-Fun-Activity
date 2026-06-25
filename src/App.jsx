import React, { useEffect, useState } from "react";
import { gamePages } from "./giftData";
import { brandQuestions } from "./brandData";

const attemptStorageKey = "growth99-wrong-attempts";

const getSavedAttempts = () => {
  try {
    return JSON.parse(localStorage.getItem(attemptStorageKey)) || [];
  } catch {
    return [];
  }
};

const saveWrongAttempt = (value) => {
  const trimmedValue = value.trim();
  if (!trimmedValue) return;

  const attempts = getSavedAttempts();
  attempts.unshift({
    value: trimmedValue,
    time: new Date().toLocaleString(),
  });
  localStorage.setItem(attemptStorageKey, JSON.stringify(attempts.slice(0, 50)));
};

function GiftBox({ gift, accent, opened, onOpen }) {
  return (
    <button
      className={`gift-card ${opened ? "gift-card--opened" : ""}`}
      style={{ "--accent": accent }}
      onClick={() => onOpen(gift)}
      type="button"
      aria-label={`Open ${gift.label}`}
    >
      <span className="gift-card__sparkle" aria-hidden="true">✦</span>
      <span className="gift">
        <span className="gift__bow gift__bow--left" />
        <span className="gift__bow gift__bow--right" />
        <span className="gift__lid" />
        <span className="gift__base" />
        <span className="gift__ribbon" />
      </span>
      <span className="gift-card__label">
        {opened ? "Open again" : gift.label}
      </span>
      <span className="gift-card__hint">
        {opened ? "Surprise revealed" : "Click to unwrap"}
      </span>
    </button>
  );
}

function SurpriseModal({ gift, onClose }) {
  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", closeOnEscape);
    document.body.classList.add("modal-open");
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.classList.remove("modal-open");
    };
  }, [onClose]);

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="reward-title">
      <button className="modal__backdrop" onClick={onClose} aria-label="Close surprise" />
      <div className="reward">
        <div className="confetti" aria-hidden="true">
          {Array.from({ length: 18 }, (_, index) => (
            <i key={index} style={{ "--i": index }} />
          ))}
        </div>

        <button className="reward__close" onClick={onClose} type="button" aria-label="Close">
          ×
        </button>

        <p className="reward__eyebrow">Surprise unlocked</p>

        <div className="unwrap" aria-hidden="true">
          <span className="unwrap__lid" />
          <span className="unwrap__base" />
          <span className="unwrap__glow" />
        </div>

        <div className="reward__content">
          <h2 id="reward-title">{gift.title}</h2>
          <div className="reward__media">
            <img
              src={gift.media}
              alt={gift.title}
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src =
                  "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&w=900&q=85";
              }}
            />
          </div>
          <p>{gift.message}</p>
          <button className="primary-button" onClick={onClose} type="button">
            Keep playing
          </button>
        </div>
      </div>
    </div>
  );
}

function BrandAnswerModal({ item, onClose, onNext, isLast }) {
  useEffect(() => {
    const closeOnEscape = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", closeOnEscape);
    document.body.classList.add("modal-open");
    return () => {
      document.removeEventListener("keydown", closeOnEscape);
      document.body.classList.remove("modal-open");
    };
  }, [onClose]);

  return (
    <div className="modal" role="dialog" aria-modal="true" aria-labelledby="brand-answer-title">
      <button className="modal__backdrop" onClick={onClose} aria-label="Close answer" />
      <div className="brand-answer">
        <div className="brand-answer__burst" aria-hidden="true">✦</div>
        <button className="reward__close" onClick={onClose} type="button" aria-label="Close">
          ×
        </button>
        <p className="brand-answer__eyebrow">Brand revealed</p>
        <div className="brand-answer__logo">
          <img
            src={item.logo}
            alt={`${item.answer} logo`}
            onError={(event) => {
              event.currentTarget.style.display = "none";
              event.currentTarget.nextElementSibling.hidden = false;
            }}
          />
          <span hidden>Add logo in<br /><strong>public/logos</strong></span>
        </div>
        <p className="brand-answer__small">The answer is</p>
        <h2 id="brand-answer-title">{item.answer}</h2>
        <button className="primary-button" onClick={isLast ? onClose : onNext} type="button">
          {isLast ? "Finish game 🎉" : "Next question →"}
        </button>
      </div>
    </div>
  );
}

function AccessGate({ onUnlock }) {
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [showPasswordPopup, setShowPasswordPopup] = useState(false);
  const [showAttempts, setShowAttempts] = useState(false);
  const meetingCodeHash = "f09401e0c575e96920b61d4eac24c9bd489a2ef6a83b0f8e8d54c0b89c39c7b3";

  const hashText = async (text) => {
    const encodedText = new TextEncoder().encode(text);
    const hashBuffer = await crypto.subtle.digest("SHA-256", encodedText);
    return Array.from(new Uint8Array(hashBuffer))
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  };

  const isValidEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const enteredValue = code.trim();
    const enteredCodeHash = await hashText(enteredValue.toLowerCase());
    if (enteredCodeHash === meetingCodeHash) {
      sessionStorage.setItem("growth99-game-unlocked", "true");
      onUnlock();
      return;
    }

    if (enteredValue.includes("@") && !isValidEmail(enteredValue)) {
      setError("Email thoda suspicious lag raha hai. Please enter a valid email 😄");
      return;
    }

    saveWrongAttempt(code);
    setError("");
    setShowPasswordPopup(true);
  };

  if (showAttempts) {
    return <AttemptBoard onBack={() => setShowAttempts(false)} />;
  }

  return (
    <main className="game access-game" style={{ "--page-accent": "#ffd166" }}>
      <div className="stars stars--one" aria-hidden="true" />
      <div className="stars stars--two" aria-hidden="true" />
      <section className="access-card">
        <div className="access-card__icon" aria-hidden="true">😂</div>
        <p className="hero__eyebrow">Caught you early</p>
        <h1>Hello, brilliant!</h1>
        <p>
          Go to the meeting first.
        </p>
        <form onSubmit={handleSubmit}>
          <label htmlFor="meeting-code">Add your email to get the password</label>
          <div>
            <input
              id="meeting-code"
              value={code}
              onChange={(event) => {
                setCode(event.target.value);
                setError("");
              }}
              placeholder="Enter email or password"
              autoComplete="off"
            />
          </div>
          <button
            className="get-password-button"
            type="submit"
          >
            Get password
          </button>
        </form>
        {error && <p className="access-card__error">{error}</p>}
      </section>

      {showPasswordPopup && (
        <div className="modal" role="dialog" aria-modal="true" aria-labelledby="password-popup-title">
          <button
            className="modal__backdrop"
            onClick={() => setShowPasswordPopup(false)}
            aria-label="Close password popup"
          />
          <div className="password-popup">
            <button
              className="reward__close"
              onClick={() => setShowPasswordPopup(false)}
              type="button"
              aria-label="Close"
            >
              ×
            </button>
            <div className="password-popup__media">
              <img
                src="/media/password-troll.gif"
                alt="Funny password reaction"
                onError={(event) => {
                  event.currentTarget.style.display = "none";
                  event.currentTarget.nextElementSibling.hidden = false;
                }}
              />
              <span hidden>Add your GIF as<br /><strong>public/media/password-troll.gif</strong></span>
            </div>
            <h2 id="password-popup-title">Nice try 😂</h2>
            <p>Not going to share password, thank you</p>
          </div>
        </div>
      )}
    </main>
  );
}

function AttemptBoard({ onBack }) {
  const [attempts, setAttempts] = useState(getSavedAttempts);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [attemptToDelete, setAttemptToDelete] = useState(null);

  const clearAttempts = () => {
    localStorage.removeItem(attemptStorageKey);
    setAttempts([]);
    setShowClearConfirm(false);
  };

  const deleteSingleAttempt = () => {
    if (!attemptToDelete) return;

    const updatedAttempts = attempts.filter((_, index) => index !== attemptToDelete.index);
    localStorage.setItem(attemptStorageKey, JSON.stringify(updatedAttempts));
    setAttempts(updatedAttempts);
    setAttemptToDelete(null);
  };

  return (
    <main className="game attempt-game" style={{ "--page-accent": "#ff8fbd" }}>
      <div className="stars stars--one" aria-hidden="true" />
      <div className="stars stars--two" aria-hidden="true" />

      <section className="attempt-board">
        <div className="access-card__icon" aria-hidden="true">🕵️</div>
        <p className="hero__eyebrow">Caught in 4K</p>
        <h1>Attempt Board</h1>
        <p>Wrong emails/passwords entered on this browser appear here.</p>

        {attempts.length === 0 ? (
          <div className="attempt-empty">No wrong attempts yet. Suspiciously innocent.</div>
        ) : (
          <ul className="attempt-list">
            {attempts.map((attempt, index) => (
              <li key={`${attempt.value}-${attempt.time}-${index}`}>
                <div>
                  <span>{attempt.value}</span>
                  <small>{attempt.time}</small>
                </div>
                <button
                  className="attempt-delete-button"
                  onClick={() => setAttemptToDelete({ ...attempt, index })}
                  type="button"
                  aria-label={`Delete attempt ${attempt.value}`}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="attempt-actions">
          <button className="nav-button nav-button--secondary" onClick={onBack} type="button">
            ← Back
          </button>
          <button className="nav-button" onClick={() => setShowClearConfirm(true)} type="button">
            Clear board
          </button>
        </div>
      </section>

      {showClearConfirm && (
        <div className="modal" role="dialog" aria-modal="true" aria-labelledby="clear-board-title">
          <button
            className="modal__backdrop"
            onClick={() => setShowClearConfirm(false)}
            aria-label="Cancel clear board"
          />
          <div className="confirm-popup">
            <div className="confirm-popup__icon" aria-hidden="true">🧹</div>
            <h2 id="clear-board-title">Clear the evidence?</h2>
            <p>This will remove all saved wrong attempts from this browser.</p>
            <div className="confirm-popup__actions">
              <button className="nav-button nav-button--secondary" onClick={() => setShowClearConfirm(false)} type="button">
                Cancel
              </button>
              <button className="nav-button" onClick={clearAttempts} type="button">
                Yes, clear it
              </button>
            </div>
          </div>
        </div>
      )}

      {attemptToDelete && (
        <div className="modal" role="dialog" aria-modal="true" aria-labelledby="delete-attempt-title">
          <button
            className="modal__backdrop"
            onClick={() => setAttemptToDelete(null)}
            aria-label="Cancel delete attempt"
          />
          <div className="confirm-popup">
            <div className="confirm-popup__icon" aria-hidden="true">🗑️</div>
            <h2 id="delete-attempt-title">Remove this attempt?</h2>
            <p>
              This will delete <strong>{attemptToDelete.value}</strong> from the board.
            </p>
            <div className="confirm-popup__actions">
              <button className="nav-button nav-button--secondary" onClick={() => setAttemptToDelete(null)} type="button">
                Cancel
              </button>
              <button className="nav-button" onClick={deleteSingleAttempt} type="button">
                Yes, delete it
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

function BrandRules({ onStart }) {
  const teamA = ["Support", "SEO", "Infra", "Social Media", "QA", "CTO"];
  const teamB = ["OB", "Product", "Paid Media", "HR", "Landing Pages", "Accounting"];

  return (
    <main className="game rules-game" style={{ "--page-accent": "#70e1f5" }}>
      <div className="stars stars--one" aria-hidden="true" />
      <div className="stars stars--two" aria-hidden="true" />

      <header className="topbar">
        <div className="brand">
          <span className="brand__icon">🎯</span>
          <span>Growth99 Fun Friday</span>
        </div>
        <div className="level-pill">Game 1 <span>/ 2</span></div>
      </header>

      <section className="rules-hero">
        <p className="hero__eyebrow">Before the chaos begins</p>
        <h1>Guess the Brand Name</h1>
        <p>Two teams. Hindi clues. Brand names. Bragging rights. Tiny bit of pressure. Perfect.</p>
      </section>

      <section className="team-board" aria-label="Team division">
        <article>
          <span className="team-board__badge">Team A</span>
          <h2>Team One</h2>
          <ul>
            {teamA.map((team) => <li key={team}>{team}</li>)}
          </ul>
        </article>
        <article>
          <span className="team-board__badge">Team B</span>
          <h2>Team Two</h2>
          <ul>
            {teamB.map((team) => <li key={team}>{team}</li>)}
          </ul>
        </article>
      </section>

      <section className="rules-card">
        <h2>Rules of the round</h2>
        <ol>
          <li>Each clue will appear in Hindi with an English pronunciation.</li>
          <li>Teams need to guess the correct brand name.</li>
          <li>The first correct answer gets <strong>+5 points</strong> for that team.</li>
          <li>If both teams shout at once, the host becomes the Supreme Court. No appeals. 😄</li>
          <li>Reveal the answer only when everyone is ready.</li>
        </ol>
      </section>

      <button className="start-game-button" onClick={onStart} type="button">
        Start Guessing Brands →
      </button>
    </main>
  );
}

function MysteryRules({ onStart, onBack }) {
  return (
    <main className="game rules-game mystery-rules-game" style={{ "--page-accent": "#bda5ff" }}>
      <div className="stars stars--one" aria-hidden="true" />
      <div className="stars stars--two" aria-hidden="true" />

      <header className="topbar">
        <button className="brand brand--button" onClick={onBack} type="button">
          <span className="brand__icon">🎁</span>
          <span>Growth99 Fun Friday</span>
        </button>
        <div className="level-pill">Game 2 <span>/ 2</span></div>
      </header>

      <section className="rules-hero">
        <p className="hero__eyebrow">Round two, maximum drama</p>
        <h1>Mystery Box Game</h1>
        <p>A wheel decides the person. A box decides the challenge. Confidence does the rest.</p>
      </section>

      <section className="steps-board" aria-label="Mystery box rules">
        <article>
          <span>1</span>
          <h2>Spin the wheel</h2>
          <p>We spin the wheel and get one lucky name. Lucky is a strong word here.</p>
        </article>
        <article>
          <span>2</span>
          <h2>Pick a box</h2>
          <p>That person chooses one mystery box from the current page.</p>
        </article>
        <article>
          <span>3</span>
          <h2>Act it out</h2>
          <p>The person needs to act and say the dialogue/challenge revealed from the box.</p>
        </article>
      </section>

      <button className="start-game-button" onClick={onStart} type="button">
        Open Mystery Boxes →
      </button>
    </main>
  );
}

function BrandGame({ onStartMystery, onViewAttempts }) {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const item = brandQuestions[questionIndex];

  const changeQuestion = (nextIndex) => {
    setShowAnswer(false);
    setQuestionIndex(nextIndex);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const showNextQuestion = () => {
    setShowAnswer(false);
    changeQuestion(questionIndex + 1);
  };

  return (
    <main className="game brand-game" style={{ "--page-accent": "#70e1f5" }}>
      <div className="stars stars--one" aria-hidden="true" />
      <div className="stars stars--two" aria-hidden="true" />

      <header className="topbar">
        <button className="brand brand--button" onClick={onStartMystery} type="button">
          <span className="brand__icon">🎯</span>
          <span>Growth99 Fun Friday</span>
        </button>
        <div className="level-pill">
          Question {questionIndex + 1} <span>/ {brandQuestions.length}</span>
        </div>
      </header>

      <section className="brand-hero">
        <p className="hero__eyebrow">Decode the Hindi clue</p>
        <h1>Guess the Brand Name</h1>
        <p>Read the clue, make your guess, and reveal the brand when everyone is ready.</p>
        <div className="progress" aria-label={`Question ${questionIndex + 1} of ${brandQuestions.length}`}>
          <span style={{ width: `${((questionIndex + 1) / brandQuestions.length) * 100}%` }} />
        </div>
      </section>

      <section className="question-card">
        <span className="question-card__number">Question {String(questionIndex + 1).padStart(2, "0")}</span>
        <div className="question-card__icon" aria-hidden="true">🤔</div>
        <h2>{item.question}</h2>
        <p>({item.pronunciation})</p>
        <button className="reveal-button" onClick={() => setShowAnswer(true)} type="button">
          Reveal Answer
        </button>
      </section>

      <nav className="navigation brand-navigation" aria-label="Brand questions">
        <button
          className="nav-button nav-button--secondary"
          onClick={() => changeQuestion(questionIndex - 1)}
          disabled={questionIndex === 0}
          type="button"
        >
          ← Previous
        </button>
        <div className="question-count">{questionIndex + 1} of {brandQuestions.length}</div>
        <button
          className="nav-button"
          onClick={() => changeQuestion(questionIndex + 1)}
          disabled={questionIndex === brandQuestions.length - 1}
          type="button"
        >
          Skip →
        </button>
      </nav>

      <button className="back-game-button" onClick={onStartMystery} type="button">
        Play Mystery Box Game 🎁
      </button>

      <footer>
        <span>{brandQuestions.length} brand clues loaded</span>
        <button className="footer-link-button" onClick={onViewAttempts} type="button">
          View attempt board
        </button>
      </footer>

      {showAnswer && (
        <BrandAnswerModal
          item={item}
          onClose={() => setShowAnswer(false)}
          onNext={showNextQuestion}
          isLast={questionIndex === brandQuestions.length - 1}
        />
      )}
    </main>
  );
}

export default function App() {
  const [isUnlocked, setIsUnlocked] = useState(
    () => sessionStorage.getItem("growth99-game-unlocked") === "true",
  );
  const [gameMode, setGameMode] = useState("brandRules");
  const [pageIndex, setPageIndex] = useState(0);
  const [selectedGift, setSelectedGift] = useState(null);
  const [openedGifts, setOpenedGifts] = useState([]);
  const page = gamePages[pageIndex];

  if (!isUnlocked) {
    return <AccessGate onUnlock={() => setIsUnlocked(true)} />;
  }

  if (gameMode === "brandRules") {
    return <BrandRules onStart={() => setGameMode("brands")} />;
  }

  if (gameMode === "brands") {
    return (
      <BrandGame
        onStartMystery={() => setGameMode("mysteryRules")}
        onViewAttempts={() => setGameMode("attempts")}
      />
    );
  }

  if (gameMode === "attempts") {
    return <AttemptBoard onBack={() => setGameMode("brands")} />;
  }

  if (gameMode === "mysteryRules") {
    return (
      <MysteryRules
        onStart={() => setGameMode("gifts")}
        onBack={() => setGameMode("brands")}
      />
    );
  }

  const openGift = (gift) => {
    setOpenedGifts((current) =>
      current.includes(gift.id) ? current : [...current, gift.id],
    );
    setSelectedGift(gift);
  };

  const changePage = (nextIndex) => {
    setSelectedGift(null);
    setPageIndex(nextIndex);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="game" style={{ "--page-accent": page.accent }}>
      <div className="stars stars--one" aria-hidden="true" />
      <div className="stars stars--two" aria-hidden="true" />

      <header className="topbar">
        <a className="brand" href="/" onClick={(event) => event.preventDefault()}>
          <span className="brand__icon">🎁</span>
          <span>Growth99 Fun Friday</span>
        </a>
        <div className="topbar__actions">
          <button className="topbar-link" onClick={() => setGameMode("brands")} type="button">
            ← Guess the Brand Name
          </button>
          <div className="level-pill">
            Level {pageIndex + 1} <span>/ {gamePages.length}</span>
          </div>
        </div>
      </header>

      <section className="hero">
        <div className="hero__emoji" aria-hidden="true">{page.emoji}</div>
        <p className="hero__eyebrow">Choose wisely, dream boldly</p>
        <h1>{page.name}</h1>
        <p className="hero__copy">
          Three Mystery boxes are waiting. Pick a box and click it to reveal what is hiding inside.
        </p>
        <div className="progress" aria-label={`Level ${pageIndex + 1} of ${gamePages.length}`}>
          <span style={{ width: `${((pageIndex + 1) / gamePages.length) * 100}%` }} />
        </div>
      </section>

      <section className="gift-grid" aria-label="Gift choices">
        {page.gifts.map((gift) => (
          <GiftBox
            key={gift.id}
            gift={gift}
            accent={page.accent}
            opened={openedGifts.includes(gift.id)}
            onOpen={openGift}
          />
        ))}
      </section>

      <nav className="navigation" aria-label="Game pages">
        <button
          className="nav-button nav-button--secondary"
          onClick={() => changePage(pageIndex - 1)}
          disabled={pageIndex === 0}
          type="button"
        >
          ← Previous
        </button>

        <div className="dots">
          {gamePages.map((item, index) => (
            <button
              key={item.name}
              className={index === pageIndex ? "dot dot--active" : "dot"}
              onClick={() => changePage(index)}
              aria-label={`Go to level ${index + 1}`}
              aria-current={index === pageIndex ? "page" : undefined}
              type="button"
            />
          ))}
        </div>

        <button
          className="nav-button"
          onClick={() => changePage(pageIndex + 1)}
          disabled={pageIndex === gamePages.length - 1}
          type="button"
        >
          Next level →
        </button>
      </nav>

      <footer>
        <span>{openedGifts.length} / 24 gifts discovered</span>
        <button className="footer-link-button" onClick={() => setGameMode("attempts")} type="button">
          View attempt board
        </button>
      </footer>

      {selectedGift && (
        <SurpriseModal gift={selectedGift} onClose={() => setSelectedGift(null)} />
      )}
    </main>
  );
}
