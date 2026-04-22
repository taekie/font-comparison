(() => {
    'use strict';

    const FONTS = [
        { value: 'PyeojinGothic',   label: '펴진고딕' },
        { value: 'Pretendard',      label: '프리텐다드' },
        { value: 'WantedSans',      label: 'Wanted Sans' },
        { value: 'Suit',            label: '수트' },
        { value: 'MinSans',         label: '민산스' },
        { value: 'SpoqaHanSansNeo', label: '스포카 한 산스 네오' },
        { value: 'Noto Sans KR',    label: '노토 산스 KR' },
    ];

    const COLOR_A_OUTLINE = '1.5px rgba(0,0,0,0.85)';
    const COLOR_B_FILL    = 'rgba(255,50,50,0.55)';
    const COLOR_BLACK     = 'rgba(0,0,0,0.88)';

    function fontLabel(family) {
        return (FONTS.find(f => f.value === family) || { label: family }).label;
    }

    const state = {
        text: '가나다라마바사 아자차카타파하 ABC abc 0123456789',
        fontA: 'PyeojinGothic',
        fontB: 'Pretendard',
        weight: 400,
        fontSizeLeft: 200,
        fontSizeRight: 24,
        charPairMode: false,
    };

    const WEIGHT_NAMES = { 300: 'Light', 400: 'Regular', 500: 'Medium', 700: 'Bold' };

    const $text             = document.getElementById('compareText');
    const $fontSelectA      = document.getElementById('fontSelectA');
    const $fontSelectB      = document.getElementById('fontSelectB');
    const $fontSizeLeft     = document.getElementById('fontSizeLeft');
    const $fontSizeLeftVal  = document.getElementById('fontSizeLeftVal');
    const $fontSizeRight    = document.getElementById('fontSizeRight');
    const $fontSizeRightVal = document.getElementById('fontSizeRightVal');
    const $charPairMode     = document.getElementById('charPairMode');

    const $leftLayerA    = document.getElementById('leftLayerA');
    const $leftLayerB    = document.getElementById('leftLayerB');
    const $leftCharPairs = document.getElementById('leftCharPairs');
    const $rightTextA    = document.getElementById('rightTextA');
    const $rightTextB    = document.getElementById('rightTextB');
    const $rightLabelA   = document.getElementById('rightLabelA');
    const $rightLabelB   = document.getElementById('rightLabelB');
    const $appSubtitle   = document.getElementById('appSubtitle');
    const $chipA         = document.getElementById('chipA');
    const $chipB         = document.getElementById('chipB');

    const $leftViewport  = document.getElementById('leftViewport');
    const $rightViewport = document.getElementById('rightViewport');

    const $modal         = document.getElementById('charModal');
    const $modalCharA    = document.getElementById('modalCharA');
    const $modalCharB    = document.getElementById('modalCharB');
    const $modalCloseBtn = document.getElementById('modalCloseBtn');
    const $modalLabelA   = document.getElementById('modalLabelA');
    const $modalLabelB   = document.getElementById('modalLabelB');

    // ===== 렌더링 =====

    function applyLayerStyle(el, family, sz, isOutline) {
        el.style.fontFamily  = `'${family}', sans-serif`;
        el.style.fontWeight  = state.weight;
        el.style.fontSize    = `${sz}px`;
        if (isOutline) {
            el.style.webkitTextStroke = COLOR_A_OUTLINE;
            el.style.color = 'transparent';
        } else {
            el.style.webkitTextStroke = '';
            el.style.color = COLOR_B_FILL;
        }
    }

    function renderLeftOverlay() {
        const txt = state.text || '';
        const sz = state.fontSizeLeft;

        $leftLayerA.style.display = '';
        $leftLayerB.style.display = '';
        $leftCharPairs.style.display = 'none';

        $leftLayerA.textContent = txt;
        applyLayerStyle($leftLayerA, state.fontA, sz, true);

        $leftLayerB.textContent = txt;
        applyLayerStyle($leftLayerB, state.fontB, sz, false);
    }

    function renderLeftCharPairs() {
        const txt = state.text || '';
        const sz = state.fontSizeLeft;

        $leftLayerA.style.display = 'none';
        $leftLayerB.style.display = 'none';
        $leftCharPairs.style.display = 'block';

        // DOM으로 안전하게 구성
        $leftCharPairs.innerHTML = '';

        for (const ch of txt) {
            if (ch === '\n') {
                $leftCharPairs.appendChild(document.createElement('br'));
                continue;
            }

            if (ch === ' ') {
                $leftCharPairs.appendChild(document.createTextNode(' '));
                continue;
            }

            const pair = document.createElement('span');
            pair.className = 'char-pair';

            const a = document.createElement('span');
            a.textContent = ch;
            a.style.fontFamily = `'${state.fontA}', sans-serif`;
            a.style.fontWeight = state.weight;
            a.style.fontSize = `${sz}px`;
            a.style.webkitTextStroke = COLOR_A_OUTLINE;
            a.style.color = 'transparent';

            const b = document.createElement('span');
            b.textContent = ch;
            b.style.fontFamily = `'${state.fontB}', sans-serif`;
            b.style.fontWeight = state.weight;
            b.style.fontSize = `${sz}px`;
            b.style.color = COLOR_B_FILL;

            pair.appendChild(a);
            pair.appendChild(b);
            $leftCharPairs.appendChild(pair);
        }
    }

    function renderLeft() {
        if (state.charPairMode) {
            renderLeftCharPairs();
        } else {
            renderLeftOverlay();
        }
    }

    function renderRight() {
        const txt = state.text || '';
        const sz = state.fontSizeRight;

        $rightTextA.textContent = txt;
        $rightTextA.style.fontFamily = `'${state.fontA}', sans-serif`;
        $rightTextA.style.fontWeight = state.weight;
        $rightTextA.style.fontSize = `${sz}px`;
        $rightTextA.style.color = COLOR_BLACK;

        $rightTextB.textContent = txt;
        $rightTextB.style.fontFamily = `'${state.fontB}', sans-serif`;
        $rightTextB.style.fontWeight = state.weight;
        $rightTextB.style.fontSize = `${sz}px`;
        $rightTextB.style.color = COLOR_BLACK;

        $rightLabelA.textContent = fontLabel(state.fontA);
        $rightLabelB.textContent = fontLabel(state.fontB);
    }

    function updateLabels() {
        const lA = fontLabel(state.fontA);
        const lB = fontLabel(state.fontB);
        $appSubtitle.textContent = `${lA} vs ${lB}`;
        $chipA.textContent = lA;
        $chipB.textContent = lB;
    }

    function render() {
        renderLeft();
        renderRight();
        updateLabels();
    }

    // ===== 이벤트 =====

    $fontSelectA.addEventListener('change', () => { state.fontA = $fontSelectA.value; render(); });
    $fontSelectB.addEventListener('change', () => { state.fontB = $fontSelectB.value; render(); });
    $text.addEventListener('input', () => { state.text = $text.value; render(); });

    $charPairMode.addEventListener('change', () => {
        state.charPairMode = $charPairMode.checked;
        renderLeft();
    });

    document.querySelectorAll('.weight-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.weight-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.weight = Number(btn.dataset.weight);
            render();
        });
    });

    $fontSizeLeft.addEventListener('input', () => {
        state.fontSizeLeft = Number($fontSizeLeft.value);
        $fontSizeLeftVal.textContent = `${state.fontSizeLeft}px`;
        renderLeft();
    });

    $fontSizeRight.addEventListener('input', () => {
        state.fontSizeRight = Number($fontSizeRight.value);
        $fontSizeRightVal.textContent = `${state.fontSizeRight}px`;
        renderRight();
    });

    // ===== 글자 클릭 → 모달 =====

    function openCharModal(char) {
        if (!char || char.trim() === '') return;

        $modalCharA.textContent = char;
        $modalCharA.style.fontFamily = `'${state.fontA}', sans-serif`;
        $modalCharA.style.fontWeight = state.weight;
        $modalCharA.style.webkitTextStroke = COLOR_A_OUTLINE;
        $modalCharA.style.color = 'transparent';
        $modalCharA.style.zIndex = '2';

        $modalCharB.textContent = char;
        $modalCharB.style.fontFamily = `'${state.fontB}', sans-serif`;
        $modalCharB.style.fontWeight = state.weight;
        $modalCharB.style.webkitTextStroke = '';
        $modalCharB.style.color = COLOR_B_FILL;
        $modalCharB.style.zIndex = '1';

        $modalLabelA.textContent = fontLabel(state.fontA);
        $modalLabelB.textContent = fontLabel(state.fontB);

        $modal.classList.add('open');
    }

    function closeModal() { $modal.classList.remove('open'); }

    $modalCloseBtn.addEventListener('click', closeModal);
    $modal.addEventListener('click', e => { if (e.target === $modal) closeModal(); });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

    function getCharAtPoint(x, y) {
        let range;
        if (document.caretRangeFromPoint) {
            range = document.caretRangeFromPoint(x, y);
        } else if (document.caretPositionFromPoint) {
            const pos = document.caretPositionFromPoint(x, y);
            if (pos) {
                range = document.createRange();
                range.setStart(pos.offsetNode, pos.offset);
                range.setEnd(pos.offsetNode, pos.offset);
            }
        }
        if (!range) return null;
        const node = range.startContainer;
        const offset = range.startOffset;
        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent;
            const idx = Math.min(offset, text.length - 1);
            const ch = text[idx];
            if (ch && ch !== '\n' && ch !== ' ') return ch;
        }
        return null;
    }

    [$leftViewport, $rightViewport].forEach(viewport => {
        viewport.addEventListener('click', e => {
            const char = getCharAtPoint(e.clientX, e.clientY);
            if (char) openCharModal(char);
        });
    });

    // ===== 초기 렌더링 =====

    document.fonts.ready.then(() => render());
    render();

})();
