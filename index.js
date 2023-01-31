import * as my_dongle from "bleuio";
document.getElementById("connect").addEventListener("click", function () {
  my_dongle.at_connect().then(() => {
    console.log("connected");
    my_dongle.at_central(() => {
      console.log("central");
    });
  });
});
var thePM10 = 0;
const repeatFunc = () => {
  my_dongle.at_findscandata("22009D", 7).then((x) => {
    let advData = x[x.length - 1];
    let advAr = advData.split(" ");
    let adv = advAr[advAr.length - 1];
    thePM10 = adv.slice(26, 28);
  });
};
document.getElementById("getData").addEventListener("click", function () {
  repeatFunc();
  setInterval(() => {
    repeatFunc();
  }, 15000);
});
var options = {
  type: "line",
  data: {
    datasets: [
      {
        label: "# of Votes",
        data: [],
        borderColor: "pink",
      },
    ],
  },
  options: {
    scales: {
      x: {
        type: "realtime",
        realtime: {
          duration: 200000,
          refresh: 1000,
          delay: 2000,
          onRefresh: (chart) => {
            const now = Date.now();
            chart.data.datasets.forEach((dataset) => {
              dataset.data.push({
                x: now,
                y: thePM10,
              });
            });
          },
        },
      },
    },
  },
};

var ctx = document.getElementById("chartJSContainer").getContext("2d");
new Chart(ctx, options);
