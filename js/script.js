
// Speed Comparison Race
(function () {
    var words = "Scientists have discovered that the human brain can process visual information much faster than most people typically read because traditional reading forces your eyes to physically move across and down the page wasting valuable time on mechanical eye movements rather than actual comprehension of the text".split(" ");

    var PLAY_ICON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>';
    var PAUSE_ICON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>';
    var RETRY_ICON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"/></svg>';

    var startBtn = document.getElementById("comparison-start");
    var traditionalEl = document.getElementById("comparison-traditional");
    var rsvpPreEl = document.getElementById("comp-rsvp-pre");
    var rsvpOrpEl = document.getElementById("comp-rsvp-orp");
    var rsvpPostEl = document.getElementById("comp-rsvp-post");
    var traditionalStatus = document.getElementById("traditional-status");
    var rsvpStatus = document.getElementById("rsvp-status");
    var resultEl = document.getElementById("comparison-result");

    if (!startBtn || !traditionalEl) return;

    var traditionalTimer = null;
    var rsvpTimer = null;
    var tIdx = 0;
    var rIdx = 0;
    var rsvpDone = false;
    var traditionalDone = false;
    var wordSpans = [];
    // States: idle, running, paused, finished
    var state = "idle";

    function compORPIndex(word) {
        var len = word.length;
        if (len <= 1) return 0;
        if (len <= 5) return 1;
        if (len <= 9) return 2;
        if (len <= 13) return 3;
        return 4;
    }

    function showRSVPWord(word) {
        var idx = compORPIndex(word);
        rsvpPreEl.textContent = word.substring(0, idx);
        rsvpOrpEl.textContent = word[idx] || "";
        rsvpPostEl.textContent = word.substring(idx + 1);
    }

    function buildTraditionalText() {
        traditionalEl.innerHTML = "";
        words.forEach(function (w, i) {
            var span = document.createElement("span");
            span.className = "comp-word";
            span.textContent = w;
            traditionalEl.appendChild(span);
            if (i < words.length - 1) {
                traditionalEl.appendChild(document.createTextNode(" "));
            }
        });
        wordSpans = traditionalEl.querySelectorAll(".comp-word");
    }

    // Build initial state — text visible, ready to go
    buildTraditionalText();
    showRSVPWord(words[0]);

    function setButton(icon, label) {
        startBtn.innerHTML = icon + " " + label;
    }

    function clearTimers() {
        clearInterval(traditionalTimer);
        clearInterval(rsvpTimer);
        traditionalTimer = null;
        rsvpTimer = null;
    }

    function resetToIdle() {
        clearTimers();
        tIdx = 0;
        rIdx = 0;
        rsvpDone = false;
        traditionalDone = false;
        traditionalStatus.textContent = "";
        traditionalStatus.className = "comparison-status";
        rsvpStatus.textContent = "";
        rsvpStatus.className = "comparison-status";
        resultEl.innerHTML = "";
        buildTraditionalText();
        showRSVPWord(words[0]);
        state = "idle";
        setButton(PLAY_ICON, "Start Comparison");
    }

    function startTimers() {
        // RSVP at ~450 WPM = 133ms
        rsvpTimer = setInterval(function () {
            rIdx++;
            if (rIdx >= words.length) {
                clearInterval(rsvpTimer);
                rsvpTimer = null;
                rsvpDone = true;
                rsvpStatus.textContent = "Done!";
                rsvpStatus.className = "comparison-status done";
                checkFinished();
                return;
            }
            showRSVPWord(words[rIdx]);
        }, 133);

        // Traditional at ~250 WPM = 240ms
        traditionalTimer = setInterval(function () {
            wordSpans[tIdx].classList.remove("comp-current");
            wordSpans[tIdx].classList.add("comp-read");
            tIdx++;
            if (tIdx >= words.length) {
                clearInterval(traditionalTimer);
                traditionalTimer = null;
                traditionalDone = true;
                traditionalStatus.textContent = "Done!";
                traditionalStatus.className = "comparison-status done";
                checkFinished();
                return;
            }
            wordSpans[tIdx].classList.add("comp-current");
        }, 240);
    }

    function checkFinished() {
        if (rsvpDone && traditionalDone) {
            state = "finished";
            setButton(RETRY_ICON, "Try Again");
            resultEl.innerHTML = 'Speed Reader finished <strong>1.8× faster</strong> with the same text';
        }
    }

    function handleClick() {
        if (state === "idle" || state === "finished") {
            // Start fresh
            if (state === "finished") resetToIdle();
            tIdx = 0;
            rIdx = 0;
            rsvpDone = false;
            traditionalDone = false;
            resultEl.innerHTML = "";
            traditionalStatus.textContent = "Reading...";
            rsvpStatus.textContent = "Reading...";
            // Mark first word as current
            wordSpans[0].classList.add("comp-current");
            showRSVPWord(words[0]);
            state = "running";
            setButton(PAUSE_ICON, "Pause");
            startTimers();
        } else if (state === "running") {
            // Pause
            clearTimers();
            state = "paused";
            setButton(PLAY_ICON, "Resume");
            traditionalStatus.textContent = "Paused";
            if (!rsvpDone) rsvpStatus.textContent = "Paused";
        } else if (state === "paused") {
            // Resume
            state = "running";
            setButton(PAUSE_ICON, "Pause");
            traditionalStatus.textContent = "Reading...";
            if (!rsvpDone) rsvpStatus.textContent = "Reading...";
            startTimers();
        }
    }

    startBtn.addEventListener("click", handleClick);
})();

// Scroll animations
(function () {
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                }
            });
        },
        { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );

    const selectors = [
        ".feature-card",
        ".mode-card",
        ".format-tag",
        ".shortcut",
        ".stat",
        ".section-header",
        ".pricing-card",
        ".formats-features",
        ".comparison-container",
    ];

    selectors.forEach((sel) => {
        document.querySelectorAll(sel).forEach((el, i) => {
            el.classList.add("fade-in");
            el.style.transitionDelay = (i * 0.06) + "s";
            observer.observe(el);
        });
    });
})();

// Refund modal
(function () {
    var modal = document.getElementById("refund-modal");
    var closeBtn = document.getElementById("refund-close");
    var openBtn = document.getElementById("refund-open-pricing");

    if (!modal) return;

    if (openBtn) {
        openBtn.addEventListener("click", function (e) {
            e.preventDefault();
            modal.classList.add("active");
        });
    }

    closeBtn.addEventListener("click", function () {
        modal.classList.remove("active");
    });

    modal.addEventListener("click", function (e) {
        if (e.target === modal) modal.classList.remove("active");
    });

    document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && modal.classList.contains("active")) {
            modal.classList.remove("active");
        }
    });
})();

// Smooth nav background on scroll
(function () {
    const nav = document.querySelector(".nav");
    let ticking = false;

    window.addEventListener("scroll", () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                if (window.scrollY > 20) {
                    nav.style.borderBottomColor = "var(--border)";
                } else {
                    nav.style.borderBottomColor = "var(--border-subtle)";
                }
                ticking = false;
            });
            ticking = true;
        }
    });
})();

// Smooth scroll for anchor links
(function () {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener("click", function (e) {
            var targetId = this.getAttribute("href");
            if (targetId === "#") return;

            var target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });
    });
})();

// Copy brew command
function copyBrewCommand(button) {
    const command = "brew install --cask speed-reader-pro/tap/speed-reader";
    navigator.clipboard.writeText(command).then(function () {
        const originalText = button.querySelector(".brew-copy-text").textContent;
        button.classList.add("copied");
        button.querySelector(".brew-copy-text").textContent = "Copied!";

        setTimeout(function () {
            button.classList.remove("copied");
            button.querySelector(".brew-copy-text").textContent = originalText;
        }, 2000);
    });
}
