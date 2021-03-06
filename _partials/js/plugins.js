// Avoid `console` errors in browsers that lack a console.
(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

//Tab setup
(function(a) {
    //Using a instead of jQuery's $ to prevent conflicts.
    a.tabbed = function(b) {
        var c = this;


        c.init = function() {
			var tabGroups = [],
				z = a(".tab_button"),
				total_tabs = z.length,
				y,x,w,
				addons = "";

            //Set the user-set speed options.
            c.options = a.extend({}, a.tabbed.defaultOptions, b);

            //Loop over all tab_buttons
            for (var i=0; i < total_tabs; i++) {

                //Select the current tab and it's next two siblings.

                y = z[i],
				x = a(y).next()[0],
                w = a(x).next()[0];


                //Add the tab_buttons and siblings to tabGroups array.
                tabGroups.push( y , x );

                //Loop over siblings until the next sibling is not a tab_button.
                //This is necessary to check for nested tab groups (e.g. tab-ception).
                do {
                    w = a(x).next()[0];
                    x = a(w).next()[0];
                    //Break loop if next sibling is not a tab_button.
                    if (a(w).hasClass("tab_button") !== true){
                        break;
                    }
                    //Add tab_buttons and siblings to tabGroups array.
                    tabGroups.push(w,x);

                }while (a(w).hasClass("tab_button") === true);

                //Check if we've already added this tab to a grouping.
                if (a(y).data("tabbed") !== true ) {

                    //Grab all tab_button classes (since they can be used as optional style alternatives)
					if (a(y).attr("data-tab") !== undefined){
                           addons = a(y).attr("data-tab");
                        }

                    //Add tabbed data to the group.
                    a(tabGroups).data("tabbed",true)
                    //Wrap the group in a section with the class 'tabbed'
					//and add add-on classes if they exist.
                        .wrapAll("<section class = 'tabbed " + addons + "' />");
                }

                //Clear out the tabGroups array and addons
				// and begin the loop again.
                tabGroups.length = 0;
				addons = "";

            }

            //To avoid stylistic confusion, we remove .tab_button and .button from each group.
            a('.tabbed').removeClass('tab_button button')
            //Add a nav element to the top of the groups.
                .prepend("<nav class='tabs' />");

            //Duplicate tab_buttons and put them inside nav.tabs
            a(".tab_button").each(function() {
                //Find the appropriate nav.tabs
                var tabNav = a(this).closest(".tabbed").children(".tabs");

                //Clone the tab_buttons and move them to nav.tabs
                //Meanwhile add .tab and remove .tab_button classes for style purposes.
                a(this).clone()
                    .appendTo(tabNav)
                    .addClass('tab')
                    .removeClass("tab_button");
            });

            //Make the first tab and tab_button in each grouping the active tab.
            a(".tabbed .tab_button:first-of-type, .tabbed .tab:first-child").addClass("active");

            //Hide all tab_content.
            a(".tab_content").hide();
            //Grab the hash/href value of each active tab.
            var d = ""+a(".active").map(function(){
				return a(this).attr("href");
			}).get();

            //Find cooresponding tab contents based on the
			// hash/href ID we just grabbed and make them active.
            a(d).each(function(){a(this).show();});

            //Try to normalize heights of all tab groupings.
            //This is particularly important for groupings with tab_sides.
            a('.tab_content').each(function(){
                var tabHeight = a(this).closest('.tabbed').find('.tabs:first').outerHeight();
                var baseline = parseInt(a("body").css('line-height'), 10);

                //Align to baseline grid.
                tabHeight = Math.ceil(tabHeight / baseline) * baseline - 1;

                a(this).css("min-height", tabHeight );
            });



            //Actions for tab clicks.
            a(".tabs .tab").click(function(e) {
                // Just making sure we don't animate already active tabs.
                if (a(this).hasClass('active') === false){

                    //Grab the target's ID through the clicked tab's href/hash value.
                    d = a(this).attr("href");

                    //Because we have nested tabs, we need to go check
                    //the closest group parent, then move back down the tree.
                    //We then hide all tab content.
                    a(this).closest('.tabbed')
                        .find(".tab_content:first")
                        .siblings(".tab_content")
                        .addBack().hide();

                    //Unhide the correct tab content.
                    a(d).fadeIn(c.options.speed);

                    //Again doing a round-about selection,
                    //this time for tab_buttons.
                    //Removing "active" class.
                    a(this).closest('.tabbed')
                        .find(".tab:first, .tab_button:first")
                        .siblings(".tab,.tab_button")
                        .addBack()
                        .removeClass("active");

                    //Adding back the "active" class to the appropriate
                    //buttons and tab contents.
                    a(this).addClass("active");
                    a(".tab_button[href^='" + d + "']").addClass("active");
                }
                e.preventDefault();
            });

            //Actions for accordion tab_buttons.
            //Nearly identical to the previous function,
            //but with a slide effect.
            a(".tab_button").click(function(e) {
                if (a(this).hasClass('active') === false){
                    d = a(this).attr("href");
                    a(this).closest('.tabbed')
                        .find(".tab_content:first")
                        .siblings(".tab_content")
                        .addBack()
                        .slideUp('fast');
                    a(d).css("min-height","0")
                        .slideToggle(c.options.speed);
                    a(this).closest('.tabbed')
                        .find(".tab:first, .tab_button:first")
                        .siblings(".tab, .tab_button")
                        .addBack()
                        .removeClass("active");
                    a(this).addClass("active");
                    a(this).closest('.tabbed')
                        .find(".tab[href^='" + d + "']")
                        .addClass("active");
                }
                e.preventDefault();
            });

        };
        c.init();
    };
    //Default options along with a targeted creation of
    a.tabbed.defaultOptions = {speed: 300};
    a.fn.tabbed = function(b) {
        return this.each(function() {
            (new a.tabbed(b));
        });
    };
})(jQuery);


//Responsive tables
(function(t){

    var all_tables = t("table");
    var y = [];
    var z;
    for(var i=0; i<all_tables.length; i++){
        var current = t(all_tables)[i];
        z = t(current).find("th").map(function(){
			t(this).each(function(){
					return this.innerText;
				});
		});
        y.push(z.prevObject);

        y = y[0];
        t(current).find("tr").each(function(){
            t(this).find("td").each(function(j){
                t(this).attr("data-th",y[j].innerText);
            });
        });
    }
})(jQuery);


// Lighten or darken a color function
// Adapted from: http://css-tricks.com/snippets/javascript/lighten-darken-color/
// Usage:
// var lightercolor = change_color("#F06D06", 20);
// var darkerColor = change_color("#F06D06", -20);

function change_color(col, amt) {

    var usePound = false;

    if (col[0] === "#") {
        col = col.slice(1);
        usePound = true;
    }

    var num = parseInt(col,16);

    var r = (num >> 16) + amt;

    if (r > 255) r = 255;
    else if  (r < 0) r = 0;

    var b = ((num >> 8) & 0x00FF) + amt;

    if (b > 255) b = 255;
    else if  (b < 0) b = 0;

    var g = (num & 0x0000FF) + amt;

    if (g > 255) g = 255;
    else if (g < 0) g = 0;

    return (usePound?"#":"") + (g | (b << 8) | (r << 16)).toString(16);

};

// Place any jQuery/helper plugins in here.
