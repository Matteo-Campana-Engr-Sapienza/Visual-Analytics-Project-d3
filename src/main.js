window.onload = () => {

  var storedData;


  d3.csv("../data/movies.csv", function(data) {

    storedData = data;

    const maxYear = d3.max(data.map((d) => +d.year));
    const minYear = d3.min(data.map((d) => +d.year));

    /*----------------------------------------------------------------------------*/
    /*------------------ Wait the finish of the resize input ---------------------*/
    /*----------------------------------------------------------------------------*/
    function resizeHandler() {
      d3.select("#circle-packing-container").select("*").remove().exit()
      d3.select("#top10Movies").select("*").remove().exit()
      drawCirclePacking(data)
      top10Movies(data)
    }

    var rtime;
    var timeout = false;
    var delta = 200;
    $(window).resize(function() {
      rtime = new Date();
      if (timeout === false) {
        timeout = true;
        setTimeout(resizeend, delta);
      }
    });

    function resizeend() {
      if (new Date() - rtime < delta) {
        setTimeout(resizeend, delta);
      } else {
        timeout = false;
        //alert('Done resizing');
        console.log('Done resizing')
        //resizeHandler()
      }
    }


    /*----------------------------------------------------------------------------*/
    /*------------------------------ first draw ----------------------------------*/
    /*----------------------------------------------------------------------------*/

    /*
    drawCirclePacking(data)
    top10Movies(data)
    */

    /*----------------------------------------------------------------------------*/
    /*----------------------------------------------------------------------------*/

    computePCA(data)

  })
}


/*----------------------------------------------------------------------------*/
/*----------------------------------------------------------------------------*/
