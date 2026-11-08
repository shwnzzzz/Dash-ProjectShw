# DASH — Site de divulgação e download

Repositório: https://github.com/shwnzzzz/Dash-ProjectShw

Site independente para apresentar o aplicativo e baixar o APK Android. O layout se adapta a celulares, tablets e computadores. Inclui capturas reais, apresentação das funções, animações, carrossel automático de seis segundos com pausa e navegação manual pelas imagens e orientações de instalação.

## Publicar no GitHub Pages

1. Use o clone local deste repositório ou extraia o pacote atualizado do site.
2. Envie **o conteúdo da pasta `DASH-site`** para a raiz do seu repositório. O `index.html` deve ficar na raiz, junto de `styles.css`, `site.js`, `assets` e `downloads`. Não envie apenas o ZIP.
3. No repositório, abra **Settings → Pages**.
4. Em **Source**, escolha **Deploy from a branch**.
5. Selecione **main** e **/(root)** e clique em **Save**.
6. Aguarde o GitHub mostrar o endereço do site.

No GitHub Free, use um repositório público para habilitar Pages. O pacote usa caminhos relativos, por isso funciona tanto em um domínio próprio quanto no endereço com nome do repositório. Não depende da hospedagem privada anterior e não pede login do ChatGPT.

Referência: [configurar a publicação no GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site).

## Enviar pelo Git

Com esta pasta conectada ao repositório, abra o terminal aqui e execute:

```sh
npm run check
git add --all
git commit -m "Atualizar site e download do DASH"
git push origin main
```

O Git precisa estar autenticado na sua conta. Também é possível abrir esta pasta no GitHub Desktop e usar **Commit** e **Push origin**.

Se o envio pelo navegador falhar, use o Git como acima. Não envie o ZIP nem um APK completo pela tela de edição de arquivos. Caso opte por **Add file → Upload files**, envie o conteúdo da pasta, incluindo `downloads/` com todas as partes. Não use Git LFS para estes arquivos: o download do site precisa receber os bytes reais de cada parte.

## O que está incluído

- `index.html`: página de apresentação e download.
- `baixar.html`: a mesma página no caminho `/baixar.html`.
- `styles.css`: estilos para mobile e PC, apenas em preto, branco e cinza.
- `site.js`: navegação pelas capturas, ampliação das imagens, animações e download.
- `assets/`: fonte Lato com licença, ícone e quatro capturas do aplicativo.
- `downloads/`: APK 2.8.2 em partes de até 4 MiB, configuração do download e checksum.
- `.nojekyll`: mantém os arquivos estáticos sem processamento pelo Jekyll.
- `scripts/`: prévia local e atualização dos arquivos do APK.

O APK já está incluído. Não é preciso configurar um link externo. Ao baixar, a página reúne as partes, verifica o SHA-256 e entrega um único arquivo `.apk`. Cada parte tem no máximo 4 MiB. O APK final continua com 42 MB e é conferido pelo SHA-256 antes do download.

Não há links para iPhone, Windows ou código-fonte na página. Este pacote é apenas o site, sem o código do aplicativo, dados de cadastros ou chaves de assinatura. As capturas mostram registros de exemplo; novos cadastros do aplicativo começam vazios.

## Conferir no computador

Requer Node.js 20 ou superior; nenhuma dependência precisa ser instalada.

```sh
npm run preview
```

Abra o endereço exibido no terminal. Evite abrir o `index.html` diretamente como arquivo: o download precisa de um servidor HTTP local ou hospedagem HTTPS. Na hospedagem final, use HTTPS para a verificação do APK pelo navegador.

## Atualizar o aplicativo oferecido

Com uma nova versão de APK já assinada, execute:

```sh
node scripts/update-apk.mjs "CAMINHO/DASH-2.8.2-Android.apk" 2.8.2
```

O script atualiza as partes, o hash e a versão exibida no HTML. Depois envie os arquivos alterados ao repositório. Use a mesma assinatura do aplicativo anterior para preservar a possibilidade de atualizar por cima da instalação existente.

## Personalizar

Edite os textos em `index.html` e os textos das abas em `site.js`. Troque as imagens em `assets/screens/`, mantendo os nomes dos arquivos ou ajustando as referências. A fonte Lato é fornecida localmente; a página não precisa buscar fontes no Google.
