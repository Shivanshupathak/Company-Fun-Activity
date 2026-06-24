import React, { useEffect, useState } from "react";
import { gamePages } from "./giftData";
import { brandQuestions } from "./brandData";

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
  const meetingCode = "fun99";

  const handleSubmit = (event) => {
    event.preventDefault();
    if (code.trim().toLowerCase() === meetingCode) {
      sessionStorage.setItem("growth99-game-unlocked", "true");
      onUnlock();
      return;
    }
    setError("Nice try, detective. Wait for the meeting code 😄");
  };

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
          <label htmlFor="meeting-code">Meeting code</label>
          <div>
            <input
              id="meeting-code"
              value={code}
              onChange={(event) => {
                setCode(event.target.value);
                setError("");
              }}
              placeholder="Enter code"
              autoComplete="off"
            />
            <button type="submit">Unlock game</button>
          </div>
          <button
            className="get-password-button"
            onClick={() => setShowPasswordPopup(true)}
            type="button"
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

function BrandGame({ onStartMystery }) {
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
  const [gameMode, setGameMode] = useState("brands");
  const [pageIndex, setPageIndex] = useState(0);
  const [selectedGift, setSelectedGift] = useState(null);
  const [openedGifts, setOpenedGifts] = useState([]);
  const page = gamePages[pageIndex];

  if (!isUnlocked) {
    return <AccessGate onUnlock={() => setIsUnlocked(true)} />;
  }

  if (gameMode === "brands") {
    return <BrandGame onStartMystery={() => setGameMode("gifts")} />;
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
        <span>Made for happy clicks ✦</span>
      </footer>

      {selectedGift && (
        <SurpriseModal gift={selectedGift} onClose={() => setSelectedGift(null)} />
      )}
    </main>
  );
}
