### UI 

Projekt w strukturze NPM

# Uruchomienie projektu
npm install


###ESDoc

    npm install --global esdoc

>Odpowiednik JSDoc-a obsługujący ECMA6


------------ ajtualziacja wszystkich zależności ----------------
npm i -g npm-check-updates
npm-check-updates -u
npm install


___

Używamy:
Babel, ECMA2016 stage 2 + Flow

    npm install --global flow-bin


generowanie dokumentacji:

1. Instalujemy JSDoc 	npm install -g esdoc
2. Poprawiamy błąd w pliku DocResolver.js:96  ->        if (autoPrivate && this.name && this.name.charAt(0) === '_') {
	
## Prototypy

	Link.propTypes = {
	  onClick: PropTypes.func,
	  target: PropTypes.string,
	  replace: PropTypes.bool,
	  to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired
	};
	Link.defaultProps = {
	  replace: false
	};
	Link.contextTypes = {
	  router: PropTypes.shape({
		history: PropTypes.shape({
		  push: PropTypes.func.isRequired,
		  replace: PropTypes.func.isRequired,
		  createHref: PropTypes.func.isRequired
		}).isRequired
	  }).isRequired
	};




## Slider

	return (
		<div>
			<Header onCreate={(header) => this.header = header}/>
			<div>
				<NavBar/>
				<article id="app-container">
					<div ref={a => {

						if (a)
							setTimeout((e) => {
								a.style.marginTop = -a.offsetHeight + "px";
							}, 1);

						if (!a || !this.layerClone)
							return;
						a.clear();
						a.appendChild(this.layerClone);
						this.prevLayer = a;


					}} className="app-prev-layer"></div>

					<div ref={a => {
						if (!a)
							return;
						this.layerClone = $tag("div");
						a.copyTo(this.layerClone);

					}} className="app-current-layer">
						<Router/>
					</div>

				</article>

			</div>
			<StatusBar/>
		</div>
	);