/**
 * THE PROTOCOL 2026 - Standalone Registration Portal
 * Direct Google Form Integration with Confirmed Operative State
 */

// Google Form Configuration
const GOOGLE_FORM_CONFIG = {
  formUrl: 'https://docs.google.com/forms/d/e/1FAIpQLScKFfelKxXfuFFkeiD3R05oSVM28QOeMIS8vR9KL8mjQbv0Ng/formResponse',
  entryName: 'entry.371560776',
  entryRollNo: 'entry.2112393183',
  entryPhone: 'entry.754048162'
};

// Subtle Web Audio Effects
const playAudioFeedback = (type = 'success') => {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'chirp') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);
      osc.start();
      osc.stop(ctx.currentTime + 0.1);
    } else {
      // Success double tone
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.start();
      osc.stop(ctx.currentTime + 0.36);
    }
  } catch (_) {
    // Ignore audio initialization restrictions
  }
};

document.addEventListener('DOMContentLoaded', () => {
  const formSection = document.getElementById('formSection');
  const statusSection = document.getElementById('statusSection');
  const thankYouSection = document.getElementById('thankYouSection');
  const regForm = document.getElementById('registrationForm');
  const errorBox = document.getElementById('errorBox');
  const submitBtn = document.getElementById('submitBtn');
  const registerAnotherBtn = document.getElementById('registerAnotherBtn');

  // Hidden form and iframe for zero-CORS submission
  const hiddenForm = document.getElementById('hiddenGoogleForm');
  const hiddenIframe = document.getElementById('hidden_iframe');

  // Confirmation view elements
  const confirmName = document.getElementById('confirmName');
  const confirmRollNo = document.getElementById('confirmRollNo');
  const confirmPhone = document.getElementById('confirmPhone');
  const confirmTimestamp = document.getElementById('confirmTimestamp');
  const confirmRefId = document.getElementById('confirmRefId');

  function showError(msg) {
    if (!msg) {
      errorBox.style.display = 'none';
      errorBox.textContent = '';
      return;
    }
    errorBox.textContent = msg;
    errorBox.style.display = 'block';
  }

  regForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    showError(null);

    const name = document.getElementById('fullName').value.trim();
    const rollNo = document.getElementById('rollNumber').value.trim().toUpperCase();
    const contact = document.getElementById('contactPhone').value.trim();

    if (!name || !rollNo || !contact) {
      showError('All fields are mandatory for operative commission.');
      return;
    }

    if (contact.replace(/\D/g, '').length < 10) {
      showError('Please provide a valid 10-digit phone or WhatsApp number.');
      return;
    }

    // Audio cue
    playAudioFeedback('chirp');

    // Show loading/commissioning state
    formSection.style.display = 'none';
    statusSection.style.display = 'flex';
    submitBtn.disabled = true;

    try {
      // Populate and submit via hidden form targeting hidden iframe (single dispatch)
      if (hiddenForm) {
        hiddenForm.action = GOOGLE_FORM_CONFIG.formUrl;
        const inputName = hiddenForm.querySelector(`[name="${GOOGLE_FORM_CONFIG.entryName}"]`);
        const inputRoll = hiddenForm.querySelector(`[name="${GOOGLE_FORM_CONFIG.entryRollNo}"]`);
        const inputPhone = hiddenForm.querySelector(`[name="${GOOGLE_FORM_CONFIG.entryPhone}"]`);
        
        if (inputName) inputName.value = name;
        if (inputRoll) inputRoll.value = rollNo;
        if (inputPhone) inputPhone.value = contact;
        
        hiddenForm.submit();
      } else {
        // Fallback to fetch if hidden form is unavailable
        const formData = new URLSearchParams();
        formData.append(GOOGLE_FORM_CONFIG.entryName, name);
        formData.append(GOOGLE_FORM_CONFIG.entryRollNo, rollNo);
        formData.append(GOOGLE_FORM_CONFIG.entryPhone, contact);

        await fetch(GOOGLE_FORM_CONFIG.formUrl, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: formData.toString()
        });
      }

      // Cinematic commissioning delay for authentic Protocol terminal experience
      await new Promise((resolve) => setTimeout(resolve, 850));

      // Play success chime
      playAudioFeedback('success');

      // Populate confirmation details
      const now = new Date();
      const timeFormatted = now.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }) + ' ' + now.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });

      const refId = `PROTO-${rollNo.replace(/[^A-Z0-9]/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;

      confirmName.textContent = name;
      confirmRollNo.textContent = rollNo;
      confirmPhone.textContent = contact;
      confirmTimestamp.textContent = timeFormatted;
      confirmRefId.textContent = refId;

      // Switch to Thank You screen
      statusSection.style.display = 'none';
      thankYouSection.style.display = 'flex';

    } catch (err) {
      console.error('Submission error:', err);
      statusSection.style.display = 'none';
      formSection.style.display = 'block';
      submitBtn.disabled = false;
      showError('Submission could not be recorded. Please verify your connection and try again.');
    }
  });

  // Handle "Register Another Operative"
  registerAnotherBtn.addEventListener('click', () => {
    regForm.reset();
    submitBtn.disabled = false;
    showError(null);
    thankYouSection.style.display = 'none';
    formSection.style.display = 'block';
  });
});
