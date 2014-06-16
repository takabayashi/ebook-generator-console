var canvas = document.getElementById('canvasPagina');
var context = canvas.getContext('2d');
var imageObj = new Image();
var imgWidth = imgDefaultWidth;
var imgHeight = imgDefaultHeight;
var paginaCapa = 0;
var paginaAtual = paginaCapa;
var zoomRatio = 1;
var ratio = 1;
var maxRatio = 2.00;
var minRatio = 0.75;
var stepRatio = 0.25;
var principalWidth = window.innerWidth; //screen.width * 0.8;
var principalHeight = window.innerHeight; //screen.height * 0.8;
var livroAtual = 1;
var qtdPaginasLivroAtual = qtdPaginas;
var isControleOEDCarregado = false;
var iFrameAberto = false;

window.onload = function (){
	//se o navegador for IE
	if (navigator.appName == 'Microsoft Internet Explorer'){
		alert("versao para Internet Explorer em construcao...");
		
	}else{
		//Verifica se o navegador suporta storagelocal
		//se suportar tenta obter a ultima pagina nagevada
		if(Modernizr.localstorage){
			if(localStorage.ultimaPagina !== 'undefined' && localStorage.ultimaPagina !== null && 
				localStorage.livroAtual !== 'undefined' && localStorage.livroAtual !== null){
				paginaAtual = localStorage.ultimaPagina;
				livroAtual = localStorage.livroAtual;
				
				if(livroAtual == 2 && !temAnexo){
					livroAtual = 1;
					paginaAtual = paginaCapa;
					
					localStorage.ultimaPagina = paginaAtual;
					localStorage.livroAtual = livroAtual;
					
				}else if(livroAtual == 2 && temAnexo){
					paginaCapa = numPaginaCapaAnexo;
				}
				//isControleOEDCa rregado = localStorage.getItem('isControleOEDCarregado');
			}else{
				paginaAtual = paginaCapa;
				localStorage.ultimaPagina = paginaAtual;
				localStorage.livroAtual = 1;
				//localStorage.setItem('isControleOEDCarregado', false);
			}
		}
		
		//altera tamanho da div principal
		document.getElementById("divPrincipal").style.width = principalWidth+'px';
		document.getElementById("divPrincipal").style.height = principalHeight+'px';
		
		//altera tamanho do canvas
		canvas.width  = imgDefaultWidth;//canvas.offsetWidth;
		canvas.height = imgDefaultHeight; //canvas.offsetHeight;
			
		//Carrega a primeira pagina ou carrega a ultima pagina navegada
		loadImgPagina(paginaAtual);
		
		qtdPaginasLivroAtual = (livroAtual == 1 ? qtdPaginas : qtdPaginasAnexo);
		
		document.getElementById("qtdPaginas").innerHTML = qtdPaginasLivroAtual;
		
		if(paginaAtual == paginaCapa){
			document.getElementById("back").style.display = 'none';
		}
		
		document.title=tituloPrincipal;
		
		window.onresize=resizePrincipal;
		
		//Trata a existencia de anexos
		if(temAnexo){
			document.getElementById("divControles").style.backgroundImage = "url('/livro-template/images/controles/controle_anexo.png')";
			
			if(livroAtual==1){
				document.getElementById("lm").style.backgroundImage = "url('/livro-template/images/controles/lm_rollover.png')";
				document.getElementById("mp").style.backgroundImage = "none";
			}else{
				document.getElementById("mp").style.backgroundImage = "url('/livro-template/images/controles/mp_rollover.png')";
				document.getElementById("lm").style.backgroundImage = "none";
				document.getElementById("divControleOED").style.display = 'none';
			}
		}else{
			document.getElementById("divControles").style.backgroundImage = "url('/livro-template/images/controles/controle.png')";
			document.getElementById("mp").style.display = 'none';
			document.getElementById("lm").style.display = 'none';
		}
		
	}
	
}

window.onunload = function(){
	localStorage.ultimaPagina = paginaCapa;
};

document.onkeydown = function(event) {
	var e = event.keyCode;

	switch(e) {
		case 13:
			go(document.getElementById("numPagina").value);
			break;
		case 27:
			document.getElementById("zoomFit").onclick.apply(document.getElementById("zoomFit"));
        	break;
	    case 37:
	    	document.getElementById("back").onclick.apply(document.getElementById("back"));
	    	return false;
	        break;
	    case 39:
	    	document.getElementById("next").onclick.apply(document.getElementById("next"));
	    	return false;
	    	break;
	    case 107:
	    	document.getElementById("zoomIn").onclick.apply(document.getElementById("zoomIn"));
	    	break;
	    case 109:
	    	document.getElementById("zoomOut").onclick.apply(document.getElementById("zoomOut"));
	    	break;
	    default:
	}
}

document.getElementById("capa").onclick = function() {
	paginaAtual = paginaCapa;
	loadImgPagina(paginaAtual);
	
	document.getElementById("back").style.display = 'none';
	document.getElementById("next").style.display = 'inherit';
	document.getElementById("back").style.display = 'none';
};

document.getElementById("back").onclick = function() {
	if(paginaAtual > paginaCapa){
		paginaAtual--;
		
		loadImgPagina(paginaAtual);
		
		if(paginaAtual == paginaCapa){
			document.getElementById("back").style.display = 'none';
		}
		
		if(document.getElementById("next").style.display == 'none'){
			document.getElementById("next").style.display = 'inherit';
		}
	}
};

document.getElementById("next").onclick = function() {
	if(paginaAtual < qtdPaginasLivroAtual){
		paginaAtual++;
		
		loadImgPagina(paginaAtual);
		
		if(paginaAtual == qtdPaginasLivroAtual){
			document.getElementById("next").style.display = 'none';
		}
		
		if(document.getElementById("back").style.display == 'none'){
			document.getElementById("back").style.display = 'inherit';
		}
	}
};

function loadImgPagina(paginaAtual){
	var paginaImg = new Image();
	
	paginaImg.onload = function() {
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.drawImage(paginaImg, 0, 0, imgWidth, imgHeight);
	};
	
	paginaImg.src = imagesPath + '/Page-' + paginaAtual + '.jpg';
		
	document.getElementById("zoomOut").onclick = function() {
		if(ratio > minRatio){
			ratio = ratio - stepRatio;
			
			imgWidth =  imgDefaultWidth*ratio;
			imgHeight =  imgDefaultHeight*ratio;
			
			context.clearRect(0, 0, canvas.width, canvas.height);
			
			canvas.width  = imgWidth;
			canvas.height = imgHeight;
			
			
			context.drawImage(paginaImg, 0, 0, imgWidth, imgHeight);
			
			loadWidgetLinks(paginaAtual, ratio);
			loadSumario(paginaAtual, ratio);
		}
	};
	
	document.getElementById("zoomIn").onclick = function() {
		if(ratio < maxRatio){
			ratio = ratio + stepRatio;
			
			imgWidth =  imgDefaultWidth*ratio;
			imgHeight =  imgDefaultHeight*ratio;
			
			canvas.width  = imgWidth;
			canvas.height = imgHeight;
			
			context.clearRect(0, 0, canvas.width+100, canvas.height);
			context.drawImage(paginaImg, 0, 0, imgWidth, imgHeight);
			
			loadWidgetLinks(paginaAtual, ratio);
			loadSumario(paginaAtual, ratio);
		}
	};
	
	document.getElementById("zoomFit").onclick = function() {
		imgWidth = imgDefaultWidth; 
		imgHeight = imgDefaultHeight;
		ratio = 1;
		
		canvas.width  = imgWidth;
		canvas.height = imgHeight;
		
		context.clearRect(0, 0, canvas.width, canvas.height);
		context.drawImage(paginaImg, 0, 0, imgWidth, imgHeight);
		
		loadWidgetLinks(paginaAtual, ratio);
		loadSumario(paginaAtual, ratio);
	};
	
	alterarTextoPaginacao(paginaAtual);
	
	loadWidgetLinks(paginaAtual, ratio);
	
	loadSumario(paginaAtual, ratio);
	
	localStorage.ultimaPagina = paginaAtual;
	localStorage.livroAtual = livroAtual;

}

function loadIFrame() {
	for(x=0;x<widgetIcon.lista.length;x++){
		var widget = widgetIcon.lista[x];
		if(paginaAtual == widget.pagina){
			document.getElementById("iframe_a").src = widget.url;
			iFrameAberto = true;
			break;
		}
	}
}

function loadWidgetLinks(paginaAtual, ratioLocal){
	
	if(livroAtual==1){
		document.getElementById("divOED").style.display = "none";
		document.getElementById("iconeOED").style.display = "none";
		
		for(x=0;x<widgetIcon.lista.length;x++){
			var widget = widgetIcon.lista[x];
			
			if(paginaAtual == widget.pagina){
				widget.leftLocation = widget.defaultLeftLocation * ratioLocal;
				widget.topLocation = widget.defaultTopLocation * ratioLocal;
				widget.width = widgetIcon.defaultWidth * ratioLocal;
				widget.height = widgetIcon.defaultHeight * ratioLocal;
				
				document.getElementById("divOED").style.top = canvas.offsetTop + widget.topLocation + 'px';
				document.getElementById("divOED").style.left = canvas.offsetLeft  + widget.leftLocation + 'px';
				
				document.getElementById("iconeOED").style.height = widget.height +'px';
				document.getElementById("iconeOED").style.width = widget.width + 'px';
				
				document.getElementById("divOED").style.display = "block";
				document.getElementById("iconeOED").style.display = "block";
				
				break;
			}
		}
	}
	
}

function go(valor) {
	if(valor=="C" || valor=="c"){
		valor = 0;
	}

	if(valor=="4C" || valor=="4c"){
		valor = qtdPaginasLivroAtual;
	}
			
	if(valor >= paginaCapa && valor <= qtdPaginasLivroAtual){
		paginaAtual = valor;
		
		loadImgPagina(paginaAtual);
		
		if(paginaAtual == paginaCapa){
			document.getElementById("back").style.display = 'none';
		}else{
			document.getElementById("back").style.display = 'block';
		}
		
		if(paginaAtual == qtdPaginasLivroAtual){
			document.getElementById("next").style.display = 'none';
		}else{
			document.getElementById("next").style.display = 'block';
		}
		
	}else{
		
		alert('pagina nao existente!');
		
		alterarTextoPaginacao(paginaAtual);
		document.getElementById("numPagina").focus();
		
		return false;
	}
}


document.getElementById("lm").onclick = function() {
	livroAtual = 1;
	paginaAtual = numPaginaCapa;
	paginaCapa = numPaginaCapa;
	
	qtdPaginasLivroAtual = qtdPaginas;
	document.getElementById("qtdPaginas").innerHTML = qtdPaginasLivroAtual;
	document.getElementById("back").style.display = 'none';
	document.getElementById("next").style.display = 'block';
	
	document.getElementById("lm").style.backgroundImage = "url('/livro-template/images/controles/lm_rollover.png')";
	document.getElementById("mp").style.backgroundImage = "none";
	
	document.getElementById("divControleOED").style.display = 'block';
				
	loadImgPagina(paginaAtual);
}

document.getElementById("mp").onclick = function() {
	livroAtual = 2;
	paginaAtual = numPaginaCapaAnexo;
	paginaCapa = numPaginaCapaAnexo;
	
	qtdPaginasLivroAtual = qtdPaginasAnexo;
	document.getElementById("qtdPaginas").innerHTML = qtdPaginasLivroAtual;
	document.getElementById("back").style.display = 'none';
	document.getElementById("next").style.display = 'block';
	
	document.getElementById("mp").style.backgroundImage = "url('/livro-template/images/controles/mp_rollover.png')";
	document.getElementById("lm").style.backgroundImage = "none";
	
	document.getElementById("divControleOED").style.display = 'none';
	document.getElementById("iconeOED").style.display = 'none';
			
	loadImgPagina(paginaAtual);
}

document.getElementById("divControleOED").onclick = function(){
	carregarControleOED();
}

document.getElementById("modalCloseLink").onclick = function(){
	window.onresize=resizePrincipal;
	document.getElementById("iconeOED").style.display = "none";
	document.getElementById("iframe_a").src = "";
	
	//altera a funcao de unload
	window.onunload = function(){console.log("desabilitado onunload")};
	
	location.href='index.html';
}

function resizePrincipal(){
	if(!iFrameAberto){
		document.getElementById("divPrincipal").style.display = 'none';
		document.getElementById("iconeOED").style.display = "none";
		document.getElementById("modalCloseLink").onclick.apply(document.getElementById("modalCloseLink"));

		location.href='index.html';
		
		//altera a funcao de unload
		window.onunload = function(){console.log("desabilitado onunload")};
		
		location.reload();
	}
}

function carregarControleOED(){
	if(isControleOEDCarregado){
		document.getElementById("listaOED").hidden=true;
		isControleOEDCarregado = false;
		
	}else{
		var divListaOED = document.getElementById("listaOED");
		document.getElementById("listaOED").hidden=false;
		isControleOEDCarregado = true;
		
		var listaHTML = "<table id='listaOrdenadaLinksOED'>";
		
		//Incluir todos os titulos da oeds no controle
		for(i=0;i<widgetIcon.lista.length; i++){
			listaHTML += montarIndiceLinkOED(i, widgetIcon.lista[i].titulo, widgetIcon.lista[i].pagina);
		}
		
		if(temAnexo){
			listaHTML += "<tr><td colspan=3 align='right' height='40px'><a href='#divModalDialog' onclick='loadIFrameManual();' ><img src='/livro-template/images/iconeManual.jpg' class='iconeManual'/></a></td></tr>";
		}
		
		
		divListaOED.innerHTML = listaHTML + "</table>";
	}
}

function alterarTextoPaginacao(pagina){
	if(pagina>0){
		if(pagina==qtdPaginasLivroAtual && (!temAnexo || livroAtual == 2)){
			document.getElementById("numPagina").value = "4C";
		}else{
			document.getElementById("numPagina").value = pagina;
		}
	}else{
		document.getElementById("numPagina").value = "C";
	}
}

function montarIndiceLinkOED(i, t, p){
	var max = 30;
	var r = "<td nowrap><a id='linkListaOED' href='javascript:go("+widgetIcon.lista[i].pagina+");' class='linkListaOED'>&nbsp;"+ (i+1) + ". " + t + "</a></td>";
	var l = t.toString().length + (p.toString().length);
		
	r = r + "<td style='text-align: center; font-family: Helvetica;'>&nbsp;&nbsp;"+ p + "&nbsp;</td>";
	
	return "<tr>" + r + "</tr>";
}

function loadIFrameManual() {
	document.getElementById("iframe_a").src = "/livro-template/widgets/0/OED/index.html";
}


function loadSumario(paginaAtual, ratioLocal){
	if(livroAtual==1){
		//exclui todas as divs anteriores
		document.getElementById("divSumario").innerHTML = "";
		
		for(x=0;x<sumario.itens.length;x++){
			var item = sumario.itens[x];
			
			if(paginaAtual == item.pagina){
				//altera o tamanho do sumario
				document.getElementById("divSumario").style.height = canvas.height +'px';
				document.getElementById("divSumario").style.width = canvas.width +'px';
				document.getElementById("divSumario").style.top = canvas.offsetTop + 'px';
				document.getElementById("divSumario").style.left = canvas.offsetLeft  + 'px';
			
				//cria uma div para cada item do sumario
				var nomeDiv = "divSumarioItem"+x;
				document.getElementById("divSumario").innerHTML += "<div onclick='go("+item.paginaTarget+")' class='divSumarioItem' id='"+nomeDiv+"'></div>";
				
				//altera o tamanho e localizacao da area do item do sumario
				item.leftLocation = item.defaultLeftLocation * ratioLocal;
				item.topLocation = item.defaultTopLocation * ratioLocal;
				document.getElementById(nomeDiv).style.top = item.topLocation + 'px';
				document.getElementById(nomeDiv).style.left = item.leftLocation + 'px';
				
				item.width = sumario.defaultWidth * ratioLocal;
				item.height = sumario.defaultHeight * ratioLocal;
				document.getElementById(nomeDiv).style.width = item.width + "px";
				document.getElementById(nomeDiv).style.height = item.height + "px";
				
				document.getElementById(nomeDiv).style.background = sumario.divStyleBackgroudColor;

			}
		}
	}
}
