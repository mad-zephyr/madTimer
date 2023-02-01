const initialConfig = [
  {
    name: "hours",
    initialValue: "00",
    subtitle: "Часы",
  },
  {
    name: "min",
    initialValue: "00",
    subtitle: "Минуты",
  },
  {
    name: "sec",
    initialValue: "00",
    subtitle: "Секунды",
  },
];

// Create Countdown
class Countdown {
  constructor(selector) {
    this.$el = $(selector);
    this.selector = selector;
    this.countdown_interval = null;
    this.total_seconds = 0;
    this.currentTime = new Date();
  }

  // Initialize the countdown
  init() {
    // DOM
    this.$ = {
      hours: this.$el.find(".bloc-time.hours .figure"),
      minutes: this.$el.find(".bloc-time.min .figure"),
      seconds: this.$el.find(".bloc-time.sec .figure"),
    };

    // Animate countdown to the end
    this.count();
  }

  getTime(initial = 60) {
    const currentTime = new Date();

    const minutes = initial - currentTime.getMinutes();
    const seconds = 60 - currentTime.getSeconds();

    const values = {
      hours: 0,
      minutes: minutes,
      seconds: minutes === 60 ? 0 : seconds,
    };

    const all_seconds =
      values.hours * 60 * 60 + values.minutes * 60 + values.seconds;

    return { values, all_seconds };
  }

  count(initial = 60) {
    const that = this;
    const $hour_1 = this.$.hours.eq(0);
    const $hour_2 = this.$.hours.eq(1);
    const $min_1 = this.$.minutes.eq(0);
    const $min_2 = this.$.minutes.eq(1);
    const $sec_1 = this.$.seconds.eq(0);
    const $sec_2 = this.$.seconds.eq(1);

    let { values, all_seconds: total_seconds } = this.getTime(initial);

    this.countdown_interval = setInterval(() => {
      if (total_seconds > 0) {
        --values.seconds;

        if (values.minutes >= 0 && values.seconds < 0) {
          values.seconds = 59;
          --values.minutes;
        }

        if (values.hours >= 0 && values.minutes < 0) {
          values.minutes = 59;
          --values.hours;
        }

        // Update DOM values
        // Hours
        that.checkTime(values.hours, $hour_1, $hour_2);

        // Minutes
        that.checkTime(values.minutes, $min_1, $min_2);

        // Seconds
        that.checkTime(values.seconds, $sec_1, $sec_2);

        --total_seconds;
      } else {
        clearInterval(this.countdown_interval);
        this.count();
      }
    }, 1000);
  }

  animateFigure($el, value) {
    const $top = $el.find(".top");
    const $bottom = $el.find(".bottom");
    const $back_top = $el.find(".top-back");
    const $back_bottom = $el.find(".bottom-back");

    // Before we begin, change the back value
    $back_top.find("span").html(value);

    // Also change the back bottom value
    $back_bottom.find("span").html(value);

    // Then animate

    TweenMax.to($top, 0.8, {
      rotationX: "-180deg",
      transformPerspective: 300,
      ease: Quart.easeOut,
      onComplete: () => {
        $top.html(`<span>${value}</span>`);

        $bottom.html(`<span>${value}</span>`);

        TweenMax.set($top, { rotationX: 0 });
      },
    });

    TweenMax.to($back_top, 0.8, {
      rotationX: 0,
      transformPerspective: 300,
      ease: Quart.easeOut,
      clearProps: "all",
    });
  }

  checkTime(value, $el_1, $el_2) {
    const val_1 = value.toString().charAt(0);
    const val_2 = value.toString().charAt(1);
    const fig_1_value = $el_1.find(".top span").html();
    const fig_2_value = $el_2.find(".top span").html();

    if (value >= 10) {
      // Animate only if the figure has changed
      if (fig_1_value !== val_1) this.animateFigure($el_1, val_1);
      if (fig_2_value !== val_2) this.animateFigure($el_2, val_2);
    } else {
      // If we are under 10, replace first figure with 0
      if (fig_1_value !== "0") this.animateFigure($el_1, 0);
      if (fig_2_value !== val_1) this.animateFigure($el_2, val_1);
    }
  }
}

class Timer {
  constructor(config) {
    this.config = config.initial || initialConfig;
    this.parent = config.parent;
  }

  create(initialValue, name, subtitle) {
    const block = document.createElement("div");
    const classes = ["bloc-time", name];
    classes.forEach((clas) => block.classList.add(clas));

    block.innerHTML = `
      <div class="figureWrapper" data-init-value="${initialValue.join("")}">
        <div class="figure ${name} ${name}-1">
          <span class="top">
            <span>${initialValue[0]}</span>
          </span>
          <span class="top-back">
            <span>${initialValue[0]}</span>
          </span>
          <span class="bottom">
            <span> ${initialValue[0]}</span>
          </span>
          <span class="bottom-back">
            <span>${initialValue[0]}</span>
          </span>
        </div>

        <div class="figure ${name} ${name}-2">
          <span class="top">
            <span>${initialValue[1]}</span>
          </span>
          <span class="top-back">
            <span>${initialValue[1]}</span>
          </span>
          <span class="bottom">
            <span>${initialValue[1]}</span>
          </span>
          <span class="bottom-back">
            <span>${initialValue[1]}</span>
          </span>
        </div>
      </div>

      <span class="count-title">${subtitle}</span>
    `;
    return block;
  }

  createTimer() {
    const timerElement = document.createElement("div");
    const timerClassName = ["countdown"];
    timerClassName.forEach((name) => timerElement.classList.add(name));

    const timerParts = this.init();

    timerParts.forEach((segment) =>
      timerElement.insertAdjacentElement("beforeend", segment)
    );

    return timerElement;
  }

  connect() {
    const targets = document.querySelectorAll(this.parent);

    targets.forEach((timer) => {
      const timerBlock = this.createTimer();
      timer.insertAdjacentElement("afterbegin", timerBlock);

      // Let's go !
      new Countdown(timer).init();
    });
  }

  init() {
    return this.config.map(({ initialValue, name, subtitle }) => {
      const values = initialValue?.toString().split("");
      return this.create(values, name, subtitle);
    });
  }
}

// const timer
