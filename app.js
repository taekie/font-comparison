(() => {
    'use strict';

    // ===== 상태 =====
    const state = {
        text: '가나다라마바사 아자차카타파하 ABC abc 0123456789',
        weight: 400,
        fontSize: 72,
        lineHeight: 1.5,
        mode: 'overlay',
        colorA: 'rgba(0,100,255,0.5)',
        colorB: 'rgba(0,200,100,0.5)',
        guidelines: false,
    };

    // 아웃라인 모드 기본 stroke 색
    const OUTLINE_STROKE = 'rgba(0,0,0,1)';

    const WEIGHT_NAMES = { 300: 'Light', 400: 'Regular', 700: 'Bold' };

    // ===== DOM 참조 =====
    const $text       = document.getElementById('compareText');
    const $fontSize   = document.getElementById('fontSize');
    const $fontSizeVal= document.getElementById('fontSizeVal');
    const $lineHeight = document.getElementById('lineHeight');
    const $lineHeightVal = document.getElementById('lineHeightVal');
    const $guidelineToggle = document.getElementById('guidelineToggle');
    const $guidelinesOverlay = document.getElementById('guidelinesOverlay');

    const $viewport   = document.getElementById('comparisonViewport');
    const $fontALayer = document.getElementById('fontALayer');
    const $fontBLayer = document.getElementById('fontBLayer');
    const $sidePaneA  = document.getElementById('sidePaneA');
    const $sidePaneB  = document.getElementById('sidePaneB');
    const $sidePaneTextA = document.getElementById('sidePaneTextA');
    const $sidePaneTextB = document.getElementById('sidePaneTextB');

    const $legendLabelA = document.getElementById('legendLabelA');
    const $legendLabelB = document.getElementById('legendLabelB');
    const $legendDotA   = document.getElementById('legendDotA');
    const $legendDotB   = document.getElementById('legendDotB');
    const $fontATag     = document.getElementById('fontATag');
    const $fontBTag     = document.getElementById('fontBTag');

    // 모달
    const $modal        = document.getElementById('charModal');
    const $modalCharA   = document.getElementById('modalCharA');
    const $modalCharB   = document.getElementById('modalCharB');
    const $modalCloseBtn= document.getElementById('modalCloseBtn');
    const $modalDotA    = document.getElementById('modalDotA');
    const $modalDotB    = document.getElementById('modalDotB');

    // 패널 토글 (모바일)
    const $panelToggleBtn = document.getElementById('panelToggleBtn');
    const $controlPanel   = document.getElementById('controlPanel');

    // ===== 렌더링 =====

    function applyTextStyle(el, fontFamily, color, isOutline) {
        el.style.fontFamily  = `'${fontFamily}', sans-serif`;
        el.style.fontWeight  = state.weight;
        el.style.fontSize    = `${state.fontSize}px`;
        el.style.lineHeight  = state.lineHeight;

        if (isOutline) {
            el.style.webkitTextStroke = `1.5px ${OUTLINE_STROKE}`;
            el.style.color = 'transparent';
        } else {
            el.style.webkitTextStroke = '';
            el.style.color = color;
        }
    }

    function render() {
        const txt = state.text || '';
        const mode = state.mode;

        // 모드에 따라 viewport 클래스 전환
        $viewport.classList.remove('overlay-mode', 'side-by-side-mode');

        if (mode === 'overlay' || mode === 'outline') {
            $viewport.classList.add('overlay-mode');

            // 오버레이/아웃라인: absolute 레이어 표시
            $fontALayer.style.display = '';
            $fontBLayer.style.display = '';
            $sidePaneA.style.display = 'none';
            $sidePaneB.style.display = 'none';

            $fontALayer.textContent = txt;
            $fontBLayer.textContent = txt;

            if (mode === 'overlay') {
                applyTextStyle($fontALayer, 'PyeojinGothic', state.colorA, false);
                applyTextStyle($fontBLayer, 'Pretendard', state.colorB, false);
            } else {
                // 아웃라인 vs 채움
                applyTextStyle($fontALayer, 'PyeojinGothic', state.colorA, true);
                applyTextStyle($fontBLayer, 'Pretendard', state.colorB, false);
            }

            // 뷰어 높이: absolute 레이어가 있으므로 min-height 조정
            const lineCount = (txt.match(/\n/g) || []).length + 1;
            const estHeight = lineCount * state.fontSize * state.lineHeight + 80;
            $viewport.style.minHeight = `${Math.max(300, estHeight)}px`;

        } else if (mode === 'sidebyside') {
            $viewport.classList.add('side-by-side-mode');
            $viewport.style.minHeight = '';

            $fontALayer.style.display = 'none';
            $fontBLayer.style.display = 'none';
            $sidePaneA.style.display = '';
            $sidePaneB.style.display = '';

            $sidePaneTextA.textContent = txt;
            $sidePaneTextB.textContent = txt;

            applyTextStyle($sidePaneTextA, 'PyeojinGothic', state.colorA, false);
            applyTextStyle($sidePaneTextB, 'Pretendard', state.colorB, false);
        }

        updateLegend();
        updateColorIndicators();
    }

    function updateLegend() {
        const wName = WEIGHT_NAMES[state.weight] || state.weight;
        $legendLabelA.textContent = `PyeojinGothic ${wName}`;
        $legendLabelB.textContent = `Pretendard ${wName}`;
        $legendDotA.style.background = state.colorA;
        $legendDotB.style.background = state.colorB;
    }

    function updateColorIndicators() {
        $fontATag.style.background = state.colorA;
        $fontBTag.style.background = state.colorB;
    }

    // ===== Weight 버튼 =====

    document.querySelectorAll('.weight-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.weight-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.weight = Number(btn.dataset.weight);
            render();
        });
    });

    // ===== 텍스트 입력 =====

    $text.addEventListener('input', () => {
        state.text = $text.value;
        render();
    });

    // ===== 글자 크기 슬라이더 =====

    $fontSize.addEventListener('input', () => {
        state.fontSize = Number($fontSize.value);
        $fontSizeVal.textContent = `${state.fontSize}px`;
        render();
    });

    // ===== 줄 간격 슬라이더 =====

    $lineHeight.addEventListener('input', () => {
        state.lineHeight = Number($lineHeight.value) / 10;
        $lineHeightVal.textContent = state.lineHeight.toFixed(1);
        render();
    });

    // ===== 렌더링 모드 =====

    document.querySelectorAll('.mode-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.mode-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            state.mode = btn.dataset.mode;
            render();
        });
    });

    // ===== 색상 프리셋 =====

    function setupColorPresets(containerSelector, colorKey, customColorId, customOpacityId) {
        const container = document.getElementById(containerSelector);
        const presetBtns = container.querySelectorAll('.color-preset-btn');
        const $customColor = document.getElementById(customColorId);
        const $customOpacity = document.getElementById(customOpacityId);

        presetBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                presetBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                state[colorKey] = btn.dataset.color;
                render();
            });
        });

        function applyCustomColor() {
            presetBtns.forEach(b => b.classList.remove('active'));
            const hex = $customColor.value;
            const opacity = Number($customOpacity.value) / 100;
            const r = parseInt(hex.slice(1,3), 16);
            const g = parseInt(hex.slice(3,5), 16);
            const b = parseInt(hex.slice(5,7), 16);
            state[colorKey] = `rgba(${r},${g},${b},${opacity.toFixed(2)})`;
            render();
        }

        $customColor.addEventListener('input', applyCustomColor);
        $customOpacity.addEventListener('input', applyCustomColor);
    }

    setupColorPresets('colorPresetsA', 'colorA', 'customColorA', 'customOpacityA');
    setupColorPresets('colorPresetsB', 'colorB', 'customColorB', 'customOpacityB');

    // ===== 가이드라인 토글 =====

    $guidelineToggle.addEventListener('change', () => {
        state.guidelines = $guidelineToggle.checked;
        $guidelinesOverlay.style.display = state.guidelines ? '' : 'none';
    });

    // ===== 글자 클릭 → 모달 =====

    function openCharModal(char) {
        if (!char || char.trim() === '') return;

        const wName = WEIGHT_NAMES[state.weight] || state.weight;

        $modalCharA.textContent = char;
        $modalCharB.textContent = char;

        $modalCharA.style.fontFamily = "'PyeojinGothic', sans-serif";
        $modalCharA.style.fontWeight = state.weight;
        $modalCharA.style.color = state.colorA;
        $modalCharA.style.webkitTextStroke = '';
        $modalCharA.style.zIndex = '1';

        $modalCharB.style.fontFamily = "'Pretendard', sans-serif";
        $modalCharB.style.fontWeight = state.weight;
        $modalCharB.style.color = state.colorB;
        $modalCharB.style.webkitTextStroke = '';
        $modalCharB.style.zIndex = '2';

        $modalDotA.style.background = state.colorA;
        $modalDotB.style.background = state.colorB;

        $modal.classList.add('open');
    }

    function closeModal() {
        $modal.classList.remove('open');
    }

    $modalCloseBtn.addEventListener('click', closeModal);

    $modal.addEventListener('click', (e) => {
        if (e.target === $modal) closeModal();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    // 뷰어 클릭 시 해당 위치의 글자 감지
    $viewport.addEventListener('click', (e) => {
        // 모달이나 패널 내부 클릭은 무시
        if (e.target.closest('.modal-box')) return;

        // 클릭 위치의 텍스트 노드에서 글자 추출
        const char = getCharAtPoint(e.clientX, e.clientY);
        if (char) openCharModal(char);
    });

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

    // ===== 모바일 패널 토글 =====

    if ($panelToggleBtn) {
        $panelToggleBtn.addEventListener('click', () => {
            $controlPanel.classList.toggle('collapsed');
        });
    }

    // ===== 초기 렌더링 =====

    document.fonts.ready.then(() => {
        render();
    });

    // 폰트 로딩 전에도 일단 렌더링
    render();

})();
