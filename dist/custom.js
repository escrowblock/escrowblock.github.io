$(document)
  .ready(function() {

    var icoStartDate = "2018-04-02 12:00:00";

    $.getJSON('//geoip.nekudo.com/api/', function(data) {
      if(data['country'] && data['country']['code'] == 'US') {
        $('.ui.modal.access-restriction').modal('show');
      }
    });

    // fix menu when passed
    $('.masthead')
      .visibility({
        once: false,
        onBottomPassed: function() {
          $('.fixed.menu').transition('fade in');
        },
        onBottomPassedReverse: function() {
          $('.fixed.menu').transition('fade out');
        }
      });

    $('.overlay').visibility({
      type: 'fixed',
      offset: 80,
      onFixed: function() {
        $(this).css("top", "calc(100% - 25px - 1.5em)");
      },
      onUnfixed: function() {
        $(this).css("top", "");
      }
    });

    // lazy load images
    $('.image').visibility({
      type: 'image',
      transition: 'vertical flip in',
      duration: 500
    });

    // create sidebar and attach to menu open
    $('.ui.sidebar')
      .sidebar('attach events', '.toc.item');

    var dp = null;
    var initDp  = false;
    // show dropdown on hover
    $('.main.menu .ui.dropdown').dropdown({
      on: 'hover',
      transition: 'swing down',
      onChange: function(value, text, $choice) {
        if($choice.attr("data-type") == "link" && $("#" + value).length != 0) {
          $('html, body').animate({
            "scrollTop": $("#" + value).offset().top
          }, "fast");
        }
        if($choice.attr("data-type") == "lang") {
          i18next.changeLanguage(value, function (err, t) {
            i18next_render(err, t);

            if($("#dplayer")[0] && initDp) {
              dp = new DPlayer({
                  container: $("#dplayer")[0],
                  video: {
                    url: '/assets/videos/escrowICOen.mp4',
                    type: 'auto',
                    pic: '/assets/videos/escrow.png'
                  },
                  subtitle: {
                    url: '/assets/videos/' + value + '.vtt',
                    color: '#000000'
                  },
                  preload: 'none',
                  autoplay: false
              });
            } else {
              initDp = true;
            }

            if (err) {
              return console.log('something went wrong loading', err);
            }
          });
        }

        if($choice.attr("data-type") == "link-root") {
          document.location = "/#" + value;
        }
      }
    });

    $('.gray-gradient.segment')
    .visibility({
      once       : false,
      continuous : true,
      onPassing  : function(calculations) {
        var newBackgroundColor = 'rgba(182, 77, 208, ' + calculations.percentagePassed +')';
        var newColor = '';
        if(calculations.percentagePassed > 0.37) {
          newColor = 'rgba(255, 255, 255, 1)';
        } else {
          newColor = 'rgba(0, 0, 0, ' + (1-calculations.percentagePassed) +')';
        }
        $(this).css('background-color', newBackgroundColor);
        $(this).css('color', newColor);
      }
    });

    $('.ui.accordion').accordion();

    var saleAddress = '0x65717fb50ee8f93827f9eeca761e108e502b255f';
    var base_url  = 'https://etherui.net/api/v1/smartcontract/mainnet/' + saleAddress  + '/';

    var updateTotalCollected = function() {
      $.get(base_url + 'totalCollected', function(data) {
        var aim = 20000; // ETH
        var totalCollected = new Number(data.data).valueOf()/1e+18;
        $('#iito-counter').attr('data-percent', 100 - Math.ceil((aim - totalCollected)/aim*100));
        $('#iito-counter').progress();
        $('.current-result-collected').html('<a _target="blank" href="https://etherscan.io/address/' + saleAddress + '">' + totalCollected + ' ETH</a>');
      })
      .fail(function(data) {
        console.warn("Error! Data: " + data.statusText);
      });
    };

    var updateCurrentStage = function() {
      $.get(base_url + 'currentStage', function(data) {
        var currentStage = new Number(data.data).valueOf(); // ETH
        var stageCount = 10 - currentStage;
        $('.iito-stage-remain').html(i18next.t('i18n-iito-stage-remain', {count: stageCount}));
        $('.current-result-stage').html(currentStage);
        $('.current-result-bonus').html((22-currentStage*2) + '%');
      })
      .fail(function(data) {
        console.warn("Error! Data: " + data.statusText);
      });
    };

    setInterval(function() {
      updateTotalCollected();
      updateCurrentStage();
    }, 1000 * 60);

    updateTotalCollected();
    updateCurrentStage();

    i18next
    	.use(window.i18nextBrowserLanguageDetector)
      .use(window.i18nextXHRBackend)
    	.init({
        backend: {
          // for all available options read the backend's repository readme file
          loadPath: 'locales/{{lng}}/{{ns}}.json',
          whitelist: ['en', 'ch', 'de', 'es', 'ru', 'ko', 'jp'],
          fallbackLng: 'en'
        }
    	}, function(err, t) {
        i18next_render(err, t);
        $('.ui.dropdown.language').dropdown('set selected', [i18next.language.split('-')[0]]);
      });

    var i18next_render = function(err, t) {
      if(i18next.language == 'cn') {
        moment.locale('zh-cn');
      } else {
        moment.locale(i18next.language);
      }

      // initialized and ready to go!
      var names = [ "i18n-title-page",
                    "i18n-top",
                    "i18n-description",
                    "i18n-brief",
                    "i18n-solution",
                    "i18n-roadmap",
                    "i18n-opportunities",
                    "i18n-iito",
                    "i18n-tokens",
                    "i18n-bonuses",
                    "i18n-team",
                    "i18n-documents",
                    "i18n-info",
                    "i18n-channels",
                    "i18n-faq",
                    "i18n-iito-wallet",
                    "i18n-escrow-gateway",
                    "i18n-iito-stage-remain",
                    "i18n-iito-stage-remain_0",
                    "i18n-iito-stage-remain_1",
                    "i18n-iito-stage-remain_2",
                    "i18n-iito-stage-remain_plural",
                    "i18n-iito-accept",
                    "i18n-from",
                    "i18n-to",
                    "i18n-period-iito",
                    "i18n-iito-description",
                    "i18n-tokens",
                    "i18n-bonuses",
                    "i18n-bonuses-period",
                    "i18n-bonuses-tokens",
                    "i18n-name-share",
                    "i18n-among-users",
                    "i18n-stored-fund",
                    "i18n-use-funds",
                    "i18n-marketing",
                    "i18n-infrastructure",
                    "i18n-development",
                    "i18n-incentive-campaign",
                    "i18n-menu",
                    "i18n-rights",
                    "i18n-whitepaper",
                    "i18n-terms-conditions",
                    "i18n-one-page-presentation",
                    "i18n-privacy-policy",
                    "i18n-brief-title-1",
                    "i18n-brief-content-1",
                    "i18n-brief-title-2",
                    "i18n-brief-content-2",
                    "i18n-brief-title-3",
                    "i18n-brief-content-3",
                    "i18n-brief-title-4",
                    "i18n-brief-content-4",
                    "i18n-solution-title",
                    "i18n-solution-content",
                    "i18n-stages",
                    "i18n-stage-title-1",
                    "i18n-stage-content-1",
                    "i18n-stage-title-2",
                    "i18n-stage-content-2",
                    "i18n-stage-title-3",
                    "i18n-stage-content-3",
                    "i18n-stage-title-4",
                    "i18n-stage-content-4",
                    "i18n-stage-title-5",
                    "i18n-stage-content-5",
                    "i18n-stage-title-6",
                    "i18n-stage-content-6",
                    "i18n-stage-title-7",
                    "i18n-stage-content-7",
                    "i18n-stage-title-8",
                    "i18n-stage-content-8",
                    "i18n-stage-title-9",
                    "i18n-stage-content-9",
                    "i18n-opportunities",
                    "i18n-opportunities-title-1",
                    "i18n-opportunities-content-1",
                    "i18n-opportunities-title-2",
                    "i18n-opportunities-content-2",
                    "i18n-token-bonus-description",
                    "i18n-team-public-profiles",
                    "i18n-team-ceo-name",
                    "i18n-team-ceo-position",
                    "i18n-team-ceo-description",
                    "i18n-team-cfo-name",
                    "i18n-team-cfo-position",
                    "i18n-team-cfo-description",
                    "i18n-team-vacancy-name",
                    "i18n-team-vacancy-position",
                    "i18n-team-vacancy-description",
                    "i18n-team-send-cv",
                    "i18n-advisors",
                    "i18n-advisor-1-name",
                    "i18n-advisor-1-position",
                    "i18n-advisor-1-description",
                    "i18n-advisor-2-name",
                    "i18n-advisor-2-position",
                    "i18n-advisor-2-description",
                    "i18n-main-documents",
                    "i18n-read-carefully",
                    "i18n-unsubscribe",
                    "i18n-submit",
                    "i18n-e-mail",
                    "i18n-e-mail-invalid",
                    "i18n-participate-application",
                    "i18n-form-completed",
                    "i18n-form-completed-subscription",
                    "i18n-form-warning",
                    "i18n-form-warning-subscription",
                    "i18n-faq-1-title",
                    "i18n-faq-1-content",
                    "i18n-faq-2-title",
                    "i18n-faq-2-content",
                    "i18n-faq-3-title",
                    "i18n-faq-3-content",
                    "i18n-faq-4-title",
                    "i18n-faq-4-content",
                    "i18n-faq-5-title",
                    "i18n-faq-5-content",
                    "i18n-faq-6-title",
                    "i18n-faq-6-content",
                    "i18n-faq-7-title",
                    "i18n-faq-7-content",
                    "i18n-faq-8-title",
                    "i18n-faq-8-content",
                    "i18n-faq-9-title",
                    "i18n-faq-9-content",
                    "i18n-faq-10-title",
                    "i18n-faq-10-content",
                    "i18n-faq-11-title",
                    "i18n-faq-11-content",
                    "i18n-faq-12-title",
                    "i18n-faq-12-content",
                    "i18n-faq-13-title",
                    "i18n-faq-13-content",
                    "i18n-faq-14-title",
                    "i18n-faq-14-content",
                    "i18n-faq-15-title",
                    "i18n-faq-15-content",
                    "i18n-faq-16-title",
                    "i18n-faq-16-content",
                    "i18n-faq-17-title",
                    "i18n-faq-17-content",
                    "i18n-faq-18-title",
                    "i18n-faq-18-content",
                    "i18n-faq-19-title",
                    "i18n-faq-19-content",
                    "i18n-faq-20-title",
                    "i18n-faq-20-content",
                    "i18n-faq-21-title",
                    "i18n-faq-21-content",
                    "i18n-access-restriction",
                    "i18n-access-restriction-detected",
                    "i18n-access-restriction-body",
                    "i18n-access-restriction-right",
                    "i18n-access-restriction-no-use",
                    "i18n-access-restriction-right-use",
                    "i18n-choose-translation",
                    "i18n-current-result",
                    "i18n-iito-token-address",
                    "i18n-business-model-title",
                    "i18n-business-model-content",
                    "i18n-advantages",
                    "i18n-advantages-seller",
                    "i18n-advantages-seller-text-1",
                    "i18n-advantages-seller-text-2",
                    "i18n-advantages-seller-text-3",
                    "i18n-advantages-seller-text-4",
                    "i18n-advantages-seller-text-5",
                    "i18n-advantages-seller-text-6",
                    "i18n-benefits-buyer",
                    "i18n-benefits-buyer-text-1",
                    "i18n-benefits-buyer-text-2",
                    "i18n-benefits-buyer-text-3",
                    "i18n-benefits-buyer-text-4",
                    "i18n-send-issue",
                    "i18n-summary",
                    "i18n-token-general",
                    "i18n-token-name",
                    "i18n-token-name-result",
                    "i18n-token-sale-start",
                    "i18n-token-sale-start-result",
                    "i18n-token-sale-ends",
                    "i18n-token-sale-ends-result",
                    "i18n-token-sale-first-price",
                    "i18n-token-sale-first-price-result",
                    "i18n-token-total-supply",
                    "i18n-token-total-supply-result",
                    "i18n-token-listing-exchanges",
                    "i18n-token-listing-exchanges-result",
                    "i18n-token-finance",
                    "i18n-token-minimum-target",
                    "i18n-token-minimum-target-result",
                    "i18n-token-maximum-cap",
                    "i18n-token-maximum-cap-result",
                    "i18n-token-total-token-supply",
                    "i18n-token-total-token-supply-result",
                    "i18n-token-total-token-distributed",
                    "i18n-token-total-token-distributed-result",
                    "i18n-token-main-price",
                    "i18n-token-main-price-result",
                    "i18n-token-accepted-currencies",
                    "i18n-token-accepted-currencies-result",
                    "i18n-token-fair-market",
                    "i18n-token-blockchain",
                    "i18n-token-blockchain-result",
                    "i18n-token-crypto-funds",
                    "i18n-token-crypto-funds-result",
                    "i18n-token-cliff-vested",
                    "i18n-token-cliff-vested-result",
                    "i18n-token-distribution",
                    "i18n-token-distribution-result",
                    "i18n-token-sale-flow",
                    "i18n-token-sale-flow-result",
                    "i18n-token-smart-contract-code",
                    "i18n-token-smart-contract-code-result",
                    "i18n-value",
                    "i18n-current-result-stage",
                    "i18n-current-result-bonus",
                    "i18n-current-result-collected",
                    "i18n-referral-program",
                    "i18n-referral-program-description",
                    "i18n-fair-iito",
                    "i18n-fair-iito-1",
                    "i18n-fair-iito-2",
                    "i18n-fair-iito-3",
                    "i18n-fair-iito-4",
                    "i18n-fair-iito-5",
                    "i18n-fair-iito-6",
                    "i18n-fair-iito-7",
                    "i18n-fair-iito-8",
                    "i18n-fair-iito-9",
                    "i18n-fair-iito-10",
                    "i18n-instructions-wallet",
                    "i18n-instructions-etherui-address",
                    "i18n-instructions-etherui-smart",
                    "i18n-instructions-mew",
                    "i18n-IITO-participating-ways"
                 ];

      for(var i in names) {
        $("." + names[i]).html(i18next.t(names[i]));
      }

      $(".moment-iito-start").html(moment(icoStartDate).format('ddd, MMMM D (Y) HH:mm UTC'));
      $('.i18n-team-vacancy-description').html(i18next.t('i18n-team-vacancy-description', {resume: '<a href="mailto:support@escrowblock.net">' + i18next.t('i18n-team-send-cv') + '</a>'}));
      $('.i18n-e-mail').attr('placeholder', i18next.t('i18n-e-mail'));

      document.title = i18next.t('i18n-title-page');
    }

    /**
     * Vega.js
     **/

    function addVg(path, id, options) {
      d3.json(path, function (error, vgSpec) {
        if (error) {
          return console.error(error);
        }
        var runtime = vega.parse(vgSpec);
        var view = new vega.View(runtime)
          .initialize(document.querySelector(id))
          .hover()
          .run();
        vegaTooltip.vega(view, options);
      })
    }

    var tokensOpts = {
      showAllFields: false,
      fields: [
        {
          field: "percents",
          title: "%",
          formatType: "number"
        }
      ]
    }
    addVg("assets/charts/token-pie.vg.json", "#token-distribution", tokensOpts);

    var bonusesOpts = {
      showAllFields: false,
      fields: []
    }

    addVg("assets/charts/bonuses-radial.vg.json", "#token-bonus", bonusesOpts);

    var bountyOpts = {
      showAllFields: false,
      fields: [
        {
          field: "percents",
          title: "%",
          formatType: "number"
        }
      ]
    }
    addVg("assets/charts/use-funds.vg.json", "#use-funds", bountyOpts);

    /**
     * Form validations
    **/
    $('.ui.form.subscription')
    .form({
      fields: {
        'email-subscription': {
          identifier : 'email-subscription',
          rules: [
            {
              type   : 'email',
              prompt : i18next.t('i18n-e-mail-invalid')
            }
          ]
        }
      }
    });

    $('.ui.form.subscription')
    .form({
      fields: {
        'email': {
          identifier : 'email',
          rules: [
            {
              type   : 'email',
              prompt : i18next.t('i18n-e-mail-invalid')
            }
          ]
        }
      },
      onSuccess: function(event, fields) {
        event.preventDefault();

        if(typeof(gtag) != "undefined") {
          // track conversion in GA
          gtag('send',
            {
              hitType: 'event',
              eventCategory: 'subscription',
              eventAction: 'send',
              eventLabel: 'main'
            }
          );
        }

        // Use Ajax to submit form data
        var url = 'https://script.google.com/macros/s/AKfycbyWWk0VdKJUIT1ghU1d7JC3jHOvKRJA5FvSIQYwHlSqIaNlceFl/exec';
        // show the loading
        $('.subscription').addClass('loading');
        var jqxhr = $.post(url, fields, function(data) {
           console.log("Success! Data: " + data.statusText);
           $('.subscription').removeClass('loading').addClass('success');
        })
        .fail(function(data) {
           console.warn("Error! Data: " + data.statusText);
           $('.subscription').removeClass('loading');
           // HACK - check if browser is Safari - and redirect even if fail b/c we know the form submits.
           if (navigator.userAgent.search("Safari") >= 0 && navigator.userAgent.search("Chrome") < 0) {
               //alert("Browser is Safari -- we get an error, but the form still submits -- continue.");
               console.log("Success! Data: " + data.statusText);
               //Success!
               $('.subscription').addClass('success');
           } else {
             $('.subscription').addClass('warning');
           }
        });
      }
    });

    /**
     *  Countdown
    **/
    if($('#wrapper-countdown').length) {

      var countdown_template =
        '<div class="time <%= label %>">' +
          '<span class="count curr top"><%= curr %></span>' +
          '<span class="count next top"><%= next %></span>' +
          '<span class="count next bottom"><%= next %></span>' +
          '<span class="count curr bottom"><%= curr %></span>' +
          '<span class="label"><%= label.length < 6 ? label : label.substr(0, 3)  %></span>' +
        '</div>';

      var labels = ['w', 'd', 'h', 'm', 's'], //['weeks', 'days', 'hours', 'minutes', 'seconds'],
          dateCountdown = $('#wrapper-countdown').attr("date") ? $('#wrapper-countdown').attr("date") : Date.now() + new Number($('#wrapper-countdown').attr("rel-date")).valueOf(),
          template = _.template(countdown_template),
          currDate = '00:00:00:00:00',
          nextDate = '00:00:00:00:00',
          parser = /([0-9]{2})/gi,
          $countdown = $('#wrapper-countdown');

      // Parse countdown string to an object
      function strfobj(str) {
        var parsed = str.match(parser),
          obj = {};
        labels.forEach(function(label, i) {
          obj[label] = parsed[i]
        });
        return obj;
      }

      // Return the time components that diffs
      function diff(obj1, obj2) {
        var diff = [];
        labels.forEach(function(key) {
          if (obj1[key] !== obj2[key]) {
            diff.push(key);
          }
        });
        return diff;
      }

      // Build the layout
      var initData = strfobj(currDate);
      labels.forEach(function(label, i) {
        $countdown.append(template({
          curr: initData[label],
          next: initData[label],
          label: label
        }));
      });

      // Starts the countdown
      $countdown.countdown(dateCountdown, function(event) {
        var newDate = event.strftime('%w:%d:%H:%M:%S'),
            data;
        if (newDate !== nextDate) {
          currDate = nextDate;
          nextDate = newDate;
          // Setup the data
          data = {
            'curr': strfobj(currDate),
            'next': strfobj(nextDate)
          };
          // Apply the new values to each node that changed
          diff(data.curr, data.next).forEach(function(label) {
            var selector = '.%s'.replace(/%s/, label),
                $node = $countdown.find(selector);
            // Update the node
            $node.removeClass('flip');
            $node.find('.curr').text(data.curr[label]);
            $node.find('.next').text(data.next[label]);
            // Wait for a repaint to then flip
            _.delay(function($node) {
              $node.addClass('flip');
            }, 50, $node);
          });
        }

        if(event.type == "finish"){
          console.log('end!');
          if($("#redirect-location").length) {
            document.location = $("#redirect-location").attr("location");
          }
        }
      });
    }

});
