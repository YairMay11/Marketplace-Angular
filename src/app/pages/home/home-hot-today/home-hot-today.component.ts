import { Component, OnInit } from '@angular/core';
import { Path } from '../../../config';
import { ProductsService } from '../../../services/products.service';
import {OwlCarouselConfig, CarouselNavigation, SlickConfig, ProductLightbox} from '../../../functions';

declare var jQuery:any;
declare var $:any;

@Component({
  selector: 'app-home-hot-today',
  templateUrl: './home-hot-today.component.html',
  styleUrls: ['./home-hot-today.component.css']
})
export class HomeHotTodayComponent implements OnInit {

  path:String = Path.url;
  indexes:Array<any> = [];
  products:Array<any> = [];
  render:Boolean = true;
  cargando:Boolean = false;

  constructor(private productsService: ProductsService) { }

  ngOnInit(): void {

    this.cargando = true;

    let getProducts = [];
    let hoy = new Date();
    let fechaOferta = null;
    

    /* TOMAMOS LA DATA DE LOS PRODUCTOS */
    this.productsService.getData()
        .subscribe(resp =>{

          /* console.log('resp',resp); */

          /* Recorremos cada producto para separar las ofertas y el stock */
          let i;

          for (i in resp){

            getProducts.push({
              "offer": JSON.parse(resp[i].offer),
              "stock": resp[i].stock
            })
            this.products.push(resp[i]);
            /* console.log('getProducts',getProducts); */

          }
          /* RECORREMOS CADA OFERTA Y STOCK PARA CLASIFICAR LAS OFERTAS ACTUALES 
          Y LOS PRODUCTOS QUE SI TENGAN EL STOCK */

          for(i in getProducts){

            fechaOferta = new Date(
              /* GENERAR FECHA DE LA OFERTA */
              parseInt(getProducts[i]["offer"][2].split("-")[0]),
              parseInt(getProducts[i]["offer"][2].split("-")[1])-1,
              parseInt(getProducts[i]["offer"][2].split("-")[2])
    
            )
    
            if(hoy < fechaOferta && getProducts[i]["stock"] > 0){
    
              this.indexes.push(i);
              this.cargando = false;
              /* console.log('this.indexes',this.indexes); */
    
            }
    
    
          }

        })
  }
   /* FUNCION QUE NOS AVISA CUANDO TERMINA EL RENDERIZADO  */
   callback(){
    if (this.render){
      this.render = false;

      /* SELECCIONAMOS EL DOM DE LA GALERIA MIXTA */

      let galleryMix_1 = $(".galleryMix_1");
      let galleryMix_2 = $(".galleryMix_2");
      let galleryMix_3 = $(".galleryMix_3");

      /* console.log('galleryMix_1',galleryMix_1.length); */

      /* RECORREMOS TODOS LOS INDICES DE LOS PRODUCTOS */

      for(let i = 0; i < galleryMix_1.length; i ++){
        
        /* RECORREMOS TODAS LAS FOTOGRAFIAS DE LAS GALERIAS DE CADA PRODUCTO */

        for(let f = 0; f < JSON.parse($(galleryMix_1[i]).attr("gallery")).length; f++){

          /* AGREGAR IMAGENES GRANDES */
          $(galleryMix_2[i]).append(

						`<div class="item">
	                    	<a href="assets/img/products/${$(galleryMix_1[i]).attr("category")}/gallery/${JSON.parse($(galleryMix_1[i]).attr("gallery"))[f]}">
	                    		
	                    		<img src="assets/img/products/${$(galleryMix_1[i]).attr("category")}/gallery/${JSON.parse($(galleryMix_1[i]).attr("gallery"))[f]}">
	                    	</a>
	                    </div>`

                    )

            /* AGREGAR IMAGENES PEQUEÑAS  */
            $(galleryMix_3[i]).append(
              `<div class="item">
                  <img src="assets/img/products/${$(galleryMix_1[i]).attr("category")}/gallery/${JSON.parse($(galleryMix_1[i]).attr("gallery"))[f]}">
                </div>`
          )

          console.log('galleryMix_3[i]',galleryMix_3[i]);
        }


      }

      OwlCarouselConfig.fnc();
      CarouselNavigation.fnc();
      SlickConfig.fnc();
      ProductLightbox.fnc();
    }
  }

}
