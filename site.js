const scriptBase = new URL('.', document.currentScript.src);
const $ = id => document.getElementById(id);

// All screenshots come from the application, with illustrative local records.
const screens = {
    inicio: { label: 'Meu Controle', chapter: '01 / MEU CONTROLE', title: ['Seu dia,', 'numa visão só.'], description: 'Abra o DASH e veja o que merece sua atenção. Saldo, tarefas pendentes, contas e agenda ficam reunidos na tela inicial.', points: ['Saldo, entradas e despesas à primeira vista', 'Atalhos para adicionar o que você precisa', 'Sua agenda e suas metas sempre por perto'], alt: 'Tela Meu Controle do DASH, com saldo zerado, atalhos, tarefas e agenda' },
    agenda: { label: 'Agenda', chapter: '02 / MINHA AGENDA', title: ['Cada compromisso', 'no seu lugar.'], description: 'Veja seus planos por dia, semana ou mês. As contas ficam em gavetas mensais com o dia de vencimento de cada pagamento.', points: ['Agenda em dia, semana, mês ou lista', 'Contas agrupadas pelo mês de vencimento', 'Lembretes para os próximos compromissos'], alt: 'Agenda do DASH com gavetas de Novembro e Dezembro e uma conta com vencimento no dia 10' },
    financas: { label: 'Finanças', chapter: '03 / FINANÇAS', title: ['Seu dinheiro,', 'mais fácil de entender.'], description: 'Registre o que entra e o que sai. Acompanhe os gastos ao longo do ano e toque em um mês para ver o resumo.', points: ['Entradas e despesas no mesmo lugar', 'Gráfico com os meses de Janeiro a Dezembro', 'Resumo de cada mês ao tocar no gráfico'], alt: 'Gráfico de gastos por mês e resumo financeiro no DASH' },
    comprovantes: { label: 'Comprovantes', chapter: '04 / CONTAS PAGAS', title: ['Pagou?', 'Guarde o comprovante.'], description: 'Encontre as contas que você já pagou, separadas por mês. Adicione o PDF do comprovante e mantenha tudo junto do pagamento.', points: ['Histórico de contas pagas por mês', 'Comprovantes PDF guardados no dispositivo', 'Abra ou baixe o arquivo quando precisar'], alt: 'Contas pagas no DASH com um comprovante PDF e botões para visualizar ou baixar' }
};
let selectedScreen = 'financas';
let tourElapsed = 0; const tourDuration = 6000;
function tourProgress(value) { document.querySelector('.product-tour').style.setProperty('--tour-progress', String(Math.min(1, Math.max(0, value)))); }
const tabs = Array.from(document.querySelectorAll('[data-screen]'));
function selectScreen(key) {
    const screen = screens[key]; if (!screen) return; selectedScreen = key; tourElapsed = 0; tourProgress(0); const index = Object.keys(screens).indexOf(key); $('tour-count').textContent = String(index + 1).padStart(2, '0') + ' / 04'; $('tour-count').setAttribute('aria-label', 'Tela ' + (index + 1) + ' de 4');
    for (const tab of tabs) { const selected = tab.dataset.screen === key; tab.setAttribute('aria-selected', String(selected)); tab.tabIndex = selected ? 0 : -1; }
    $('tour-panel').setAttribute('aria-labelledby', 'tab-' + key);
    $('tour-chapter').textContent = screen.chapter;
    $('tour-title').replaceChildren(document.createTextNode(screen.title[0]), document.createElement('br'), document.createTextNode(screen.title[1]));
    $('tour-description').textContent = screen.description;
    $('tour-points').replaceChildren(...screen.points.map(text => { const li = document.createElement('li'); li.textContent = text; return li; }));
    const photo = $('feature-photo'); photo.src = new URL('assets/screens/' + key + '.png', scriptBase).href; photo.alt = screen.alt; photo.classList.remove('tour-photo-enter'); void photo.offsetWidth; photo.classList.add('tour-photo-enter'); $('tour-panel').classList.remove('tour-photo-enter'); void $('tour-panel').offsetWidth; $('tour-panel').classList.add('tour-photo-enter');
    $('screen-zoom').setAttribute('aria-label', 'Ampliar imagem de ' + screen.label);
}
tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => selectScreen(tab.dataset.screen));
    tab.addEventListener('keydown', event => {
        let next; if (event.key === 'ArrowRight') next = (index + 1) % tabs.length; else if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length; else if (event.key === 'Home') next = 0; else if (event.key === 'End') next = tabs.length - 1; else return;
        event.preventDefault(); selectScreen(tabs[next].dataset.screen); tabs[next].focus();
    });
});
const tour = document.querySelector('.product-tour'); const motionPreference = matchMedia('(prefers-reduced-motion: reduce)'); let tourRunning = !motionPreference.matches; let tourVisible = false; let tourHover = false; let tourLastTick = performance.now();
function refreshTourControl() { $('tour-autoplay').setAttribute('aria-label', tourRunning ? 'Pausar carrossel' : 'Reproduzir carrossel'); $('tour-play-icon').setAttribute('href', tourRunning ? '#i-pause' : '#i-play'); }
function advanceTour(direction) { const order = Object.keys(screens); selectScreen(order[(order.indexOf(selectedScreen) + direction + order.length) % order.length]); }
$('tour-previous').addEventListener('click', () => advanceTour(-1)); $('tour-next').addEventListener('click', () => advanceTour(1));
$('tour-autoplay').addEventListener('click', () => { tourRunning = !tourRunning; tourLastTick = performance.now(); refreshTourControl(); });
refreshTourControl();
tour.querySelectorAll('.screen-zoom,.tour-tabs,.tour-buttons').forEach(area => { area.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') tourHover = true; }); area.addEventListener('pointerleave', () => { tourHover = false; }); });
if ('IntersectionObserver' in window) { const visibility = new IntersectionObserver(entries => { tourVisible = entries[0].isIntersecting; }, { threshold: .25 }); visibility.observe(tour); } else tourVisible = true;
motionPreference.addEventListener?.('change', event => { if (event.matches) { tourRunning = false; refreshTourControl(); } });
setInterval(() => { const now = performance.now(); const elapsed = Math.min(250, now - tourLastTick); tourLastTick = now; const focused = tour.querySelector(':focus-visible'); const keyboardHold = focused && focused.id !== 'tour-autoplay'; if (!tourRunning || !tourVisible || tourHover || keyboardHold || document.hidden || $('screen-dialog').open) return; tourElapsed += elapsed; tourProgress(tourElapsed / tourDuration); if (tourElapsed >= tourDuration) advanceTour(1); }, 100);
const dialog = $('screen-dialog');
$('screen-zoom').addEventListener('click', () => { const screen = screens[selectedScreen]; $('dialog-photo').src = $('feature-photo').src; $('dialog-photo').alt = screen.alt; $('dialog-caption').textContent = screen.label + ' no DASH · Captura de exemplo'; dialog.showModal(); });
$('close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });

if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    document.documentElement.classList.add('js');
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), { threshold: .08 });
    document.querySelectorAll('.reveal').forEach(element => observer.observe(element));
}

const prepare = $('prepare'), save = $('save'), status = $('status'), progress = $('progress'), wrap = $('progress-wrap'), percentage = $('percentage');
const manifestUrl = new URL('downloads/android.json', scriptBase);
const downloadDirectory = new URL('downloads/', scriptBase);
let objectUrl = '', controller = null;
function validateManifest(manifest) {
    if (!manifest || !Number.isInteger(manifest.size) || manifest.size < 1 || manifest.size > 100 * 1024 * 1024 || !Array.isArray(manifest.parts) || !manifest.parts.length || manifest.parts.length > 32 || !/^[a-f0-9]{64}$/.test(manifest.sha256) || !/^[a-z0-9._-]+\.apk$/i.test(manifest.filename)) throw new Error('Invalid manifest');
    let sum = 0;
    for (const part of manifest.parts) {
        if (!part || typeof part.url !== 'string' || !Number.isInteger(part.size) || part.size < 1 || part.size > 25 * 1024 * 1024) throw new Error('Invalid part');
        const url = new URL(part.url, manifestUrl); if (url.origin !== downloadDirectory.origin || !url.pathname.startsWith(downloadDirectory.pathname)) throw new Error('Invalid path'); sum += part.size;
    }
    if (sum !== manifest.size) throw new Error('Invalid size'); return manifest;
}
async function readManifest(signal) { const response = await fetch(manifestUrl, { credentials: 'same-origin', cache: 'no-store', signal }); if (!response.ok) throw new Error('Manifest unavailable'); return validateManifest(await response.json()); }
function updateMetadata(manifest) { document.querySelectorAll('[data-apk-size]').forEach(el => { el.textContent = Math.ceil(manifest.size / 1000000) + ' MB'; }); if (typeof manifest.version === 'string' && /^\d+\.\d+\.\d+$/.test(manifest.version)) document.querySelectorAll('[data-version]').forEach(el => { el.textContent = 'Versão ' + manifest.version; }); }
readManifest().then(updateMetadata).catch(() => { });
prepare.addEventListener('click', async () => {
    if (controller) return; controller = new AbortController(); const signal = controller.signal;
    prepare.disabled = true; $('prepare-label').textContent = 'Preparando download…'; status.textContent = 'Mantenha esta página aberta enquanto o arquivo é preparado.'; wrap.hidden = false; progress.value = 0; percentage.textContent = '0%'; save.hidden = true;
    try {
        const manifest = await readManifest(signal); updateMetadata(manifest);
        const bytes = new Uint8Array(manifest.size); let offset = 0;
        for (const part of manifest.parts) {
            const response = await fetch(new URL(part.url, manifestUrl), { credentials: 'same-origin', signal }); if (!response.ok || !response.body) throw new Error('Part unavailable');
            const reader = response.body.getReader(); let partSize = 0;
            while (true) { const { done, value } = await reader.read(); if (done) break; if (offset + value.length > bytes.length || partSize + value.length > part.size) throw new Error('Unexpected size'); bytes.set(value, offset); offset += value.length; partSize += value.length; progress.value = Math.floor(offset / bytes.length * 100); percentage.textContent = progress.value + '%'; }
            if (partSize !== part.size) throw new Error('Incomplete part');
        }
        if (offset !== manifest.size) throw new Error('Incomplete download'); status.textContent = 'Conferindo o aplicativo…';
        const digest = await crypto.subtle.digest('SHA-256', bytes); const hash = Array.from(new Uint8Array(digest), x => x.toString(16).padStart(2, '0')).join(''); if (hash !== manifest.sha256) throw new Error('Checksum mismatch');
        if (signal.aborted) throw new DOMException('Canceled', 'AbortError');
        if (objectUrl) URL.revokeObjectURL(objectUrl); objectUrl = URL.createObjectURL(new Blob([bytes], { type: 'application/vnd.android.package-archive' })); save.href = objectUrl; save.download = manifest.filename; save.hidden = false; prepare.hidden = true; wrap.hidden = true; status.textContent = 'Pronto! Toque em Salvar aplicativo para baixar o APK.'; save.focus({ preventScroll: true });
    } catch (error) {
        const canceled = signal.aborted || error.name === 'AbortError'; status.textContent = canceled ? 'Download cancelado. Você pode tentar novamente.' : 'Não deu pra concluir o download. Confira a conexão e tente novamente.'; prepare.disabled = false; $('prepare-label').textContent = canceled ? 'Baixar aplicativo' : 'Tentar novamente'; wrap.hidden = true;
    } finally { controller = null; }
});
$('cancel-download').addEventListener('click', () => controller?.abort());
save.addEventListener('click', () => { status.textContent = 'Download iniciado. Abra o APK no Android para instalar.'; });
window.addEventListener('pagehide', event => { if (!event.persisted) { controller?.abort(); if (objectUrl) URL.revokeObjectURL(objectUrl); } });
