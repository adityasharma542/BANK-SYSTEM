// INTERVIEW CHEAT SHEET MODAL HANDLER
document.addEventListener('DOMContentLoaded', () => {
    const interviewModal = document.getElementById('interview-modal');
    const btnOpen = document.getElementById('btn-interview-guide');
    const btnClose1 = document.getElementById('btn-close-interview-modal');
    const btnClose2 = document.getElementById('btn-close-interview-modal-footer');
    const btnCopyPitch = document.getElementById('btn-copy-pitch');
    const pitchTextEl = document.getElementById('pitch-text');
    const copyBtnText = document.getElementById('copy-btn-text');

    if (btnOpen && interviewModal) {
        btnOpen.addEventListener('click', () => {
            interviewModal.classList.remove('hidden');
        });
    }

    if (btnClose1) {
        btnClose1.addEventListener('click', () => {
            interviewModal.classList.add('hidden');
        });
    }

    if (btnClose2) {
        btnClose2.addEventListener('click', () => {
            interviewModal.classList.add('hidden');
        });
    }

    if (btnCopyPitch && pitchTextEl) {
        btnCopyPitch.addEventListener('click', () => {
            navigator.clipboard.writeText(pitchTextEl.innerText.trim());
            copyBtnText.innerText = 'Copied!';
            btnCopyPitch.classList.add('bg-emerald-500/20', 'text-emerald-300');
            setTimeout(() => {
                copyBtnText.innerText = 'Copy Script';
                btnCopyPitch.classList.remove('bg-emerald-500/20', 'text-emerald-300');
            }, 2000);
        });
    }
});
