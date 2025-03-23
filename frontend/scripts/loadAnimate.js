document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        // animate title
      let h1 = document.getElementById("main alignment");
      h1.classList.remove("opacity-0", "translate-y-5");
      h1.classList.add("opacity-100", "translate-y-0");

      console.log("Title animated");
  
    }, 200);

    setTimeout(() => {
        //animate drop-down menu
      let select = document.getElementById("relationships");
      select.classList.remove("opacity-0", "translate-y-5");
      select.classList.add("opacity-100", "translate-y-0");
      
    }, 400);
  });
  