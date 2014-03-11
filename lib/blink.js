(function($)
{
        $.fn.blink = function(options)
        {
                var defaults = { delay:200, times:-1, visible:true };
                var options = $.extend(defaults, options);
                
                return this.each(function()
                {
                        var obj = $(this);
                        if (obj.attr("timerid") > 0) return;
						obj.attr("currentTime", 0);
                        var timerid=setInterval(function()
                        {
                                if($(obj).css("visibility") == "visible")
                                {
                                        $(obj).css('visibility','hidden');
                                }
                                else
                                {
                                        $(obj).css('visibility','visible');
										
										var cTime = parseInt(obj.attr("currentTime")) + 1;
										//console.log(cTime + " " + options.times);
										obj.attr("currentTime", cTime);
										
										if (cTime >= options.times && options.times >= 0) {
											obj.unblink({visible:options.visible});
										}
                                }
                        }, options.delay);
                        obj.attr("timerid", timerid);
                });
        }
        $.fn.unblink = function(options) 
        {
                var defaults = { visible:true };
                var options = $.extend(defaults, options);
                
                return this.each(function() 
                {
                        var obj = $(this);
                        if (obj.attr("timerid") > 0) 
                        {
                                clearInterval(obj.attr("timerid"));
                                obj.attr("timerid", 0);
                                obj.css('visibility', options.visible?'visible':'hidden');
                        }
                });
        }
}(jQuery))