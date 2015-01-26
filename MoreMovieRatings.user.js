// ==UserScript==
// @name         MoreMovieRatings
// @namespace    http://www.jayxon.com/
// @version      0.1.1
// @description  show IMDb rating on Douban, and vice versa
// @author       JayXon
// @match        http://movie.douban.com/subject/*
// @match        http://www.imdb.com/title/tt*
// @grant        none
// ==/UserScript==

(function() {
    var host = location.hostname;
    if (host === "movie.douban.com") {
        var id = $("#info a[href^='http://www.imdb.com/']").text();
        if (!id || id.lastIndexOf("tt", 0) !== 0) {
            return;
        }
        $.getJSON("http://www.omdbapi.com/?i=" + id + "&tomatoes=true", function(data) {
            var sectl = $("#interest_sectl");
            // IMDb
            if (data.imdbRating !== "N/A") {
                sectl.append("<br><strong style=color:red class='imdb ll'>IMDb:</strong>");
                sectl.append("<br><span class='imdb ll bigstar" + 5 * Math.round(data.imdbRating) + "'></span><strong class='imdb ll rating_num'>" + data.imdbRating + "</strong>");
                sectl.append("<br>(<a href=http://www.imdb.com/title/" + id + "/ratings target=_blank >" + data.imdbVotes.replace(/,/g, '') + "人评价</a>)");
                $(".imdb").css({"-webkit-filter": "hue-rotate(90deg)", "filter": "hue-rotate(90deg)"});
            }
            
            // Metascore
            if (data.Metascore !== "N/A") {
                var metascore = parseInt(data.Metascore);
                var metacolor;
                if (metascore >= 60) {
                    metacolor = "#6c3";
                } else if (metascore >= 40) {
                    metacolor = "#fc3";
                } else {
                    metacolor = "#f00";
                }
                sectl.append("<br>Metascore: <span id=metascore>" + data.Metascore + "</span>");
                $("#metascore").css({"height": "24px", "width": "24px", "line-height": "24px", "background-color": metacolor, "color": "#fff", "vertical-align": "middle", "display": "inline-block", "text-align": "center", "font-weight": "bold"});
            }
            
            // Rotten Tomatoes
            if (data.tomatoMeter !== "N/A") {
                var tomatoimg;
                if (data.tomatoImage === "certified") {
                    tomatoimg = "iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAEyElEQVR4AdWTY4DkSABGXyXpTqYxRk+PT2sLZ9u2bdu2bdvmeG27b8dWWkhSZxO/7sWo7xX53yP4C/yGGtx7M/f+20xWtivNE5mOBAGicp4zZ+4C53Pg3X8l0DVh3H+695GjDuLwxqjklsd8lBbaDN/Y+vZaP89FcaHDqDyn9dQbkxcBz/xtwaAC19CZz3jm1a4X+gfVOhcfH+G9SjejBqeonaMzYpDFgy96OHi3GMUBG78Oi2fw3lG3mwcAsT8VDP4m/FV97pd9GB/WGDS1KRQVSE4+IMxDs3OZEjTJVGwkMHJQikPPz+SW80z6TMGSma7lwNA/FBiaMFY+m9V307uanpUuOfmgKO9U6l+HR4lZKue9HKQs6HDqZm3oikN/WLAipHHZPX5KAjbnHh7htefFPcCZfI/Gzzh3d//NxaNj+hYtBg++4qG8THLkPjGqm7O5e3ohfQv6aGkQxNI34ooxK8nwwdANbIZtlGLUJjajh1sEjzHOGHXowE1A629a0Pt2Vuym9zRji/EpSgocKsocLvyigh7Nz4LVCTxzenAhMXYsYJdglHHlvWwV6MaMCl76OI0PanROODDCp2/LH1vxo2Byhb5Z9XPu2qNu9JHhl1xwdJgQmTxYE6AkIVmUpaFKgcsFAUUwfrrJ/CIXnjGCC8vX8dS7GmZEECxwGO6jFQj+QnDqlhlX335H8goFAaqksdbLxx/ks9faGHqGxsW7ZeCNSbRei/WjvJz2Qi+jVsWYm6XSMtTNTic30tCnMHyjFMl13h+zNX5cUEjHUnCkgHZB5u1+DvYluW+cQXxsBkWmxa5zTQY1WNwmFELFGsPXCEYOOIysj6MZfoacY2IlVaTb4TeDLEAIW0UCqToDxxaIPJWzvQauiAuJRqo4RSoe46DP+5kxwYcEpABUSHyShn52GGwBUe23gvqQtU5J6EgNFFNF1UDRBcKrIoJ+SElEdwzFLSiwYKMVMRQBErAERBQHY5WOXurQFib+G8H8hvgnyoCXL9bGsRokVliiNMdRZBy1O4qqqCTaTGhPIWLg9Fnca6cYprkwHQdHKuQuTRKIChbPEp/8RhBOOD33vas0dRZdUrzDhdvyxGMPc8TRx4G0KdtgI6ZOHE9HcwPX3HgTjz76KG9VVhOq+ozLH36IpfPn49EVojc4HHPErjQ3zO35jaB4WP7F9WPLi70rY8xpNJm9cAVjmsMYHi+azCXc20V1kyTUESPl7uHFV98jsMlwTDNBTTPsd9Il335vcATqpOBRwNE/CrICaUcUb2js3dJuo/TbrP3oCzq7ljKz3WL9nDcZ1OlQvtmevL8uwsKuJPH+TGa0xhk+qBB/YQXvrYvy8hM3EdjvEtpMSVZMEl7acefCytZLRGbAc9wxD41+tDeUojIkiX/cCgKMybnEpnei+DUc00IIkFIihIIQgmQq+e2zy+OGpETNMbC/mQRZBsVjM9huTx+rq8IIAN3jOmT/28c//1FlBDuRAkBLOM1OOBni7yBxlOy0LSxVQqZOsSLJlomFdU+v3kkD8Aa8g1r7QF3aRv/KvhoBQ4Bi/gG2Y5+lKNrx/lxPhdgukJbwGkMmHD+iDQD/oLxPfGWZ1wA6/Hc86d7di7fccJbb5R7N/56vAEDvDGwghbBBAAAAAElFTkSuQmCC";
                } else if (data.tomatoImage === "fresh") {
                    tomatoimg = "iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAFBElEQVR4Aa2VA7TszBpEd6c7yfiY13q2bdu2bdu2bdu2bdtHGGei7u9l8Ju4tVaNsKtaieJsyA917djNjrzk9z/a/hzwKc6BDGdDpbo/e3i1es3NYPtrrX+1K0B0XAI8rUJtvKA6E+6J/9XV57/I9PX/mGX/A77D2ZQ6xRuFBzgAE+r6ngvO3ODoFVfuV58LyvZPvSs1zt+wP/3W/56YRPnuf3698xGgc45GIChvam/1KqsXnLnYwQvN3nTPhWeulXStIXO0kjb/+vh/zEVue/AZUvPi1f8kgx+ttT8GJGd7BABTvlm5/NX3vlEuM3/TxaUSTdH8+7d9yv/oUGsY6pecJlguMb8z2M7/3Pvd5k+3Pv/DP+y8D/jXWQYESgXXPDh7p/lbHnhcfqh6QV02DFKo4fhnU6hVNIcWNO4fEUEno1sExg2fcGvw73984l8v/M5vN98CJKcbMOXpmdtecvWljasu3fNif4459p+UPx30+f6NF9ChR9bLiaqG0PeY++uA+759g1rHsjal+d2hkJ9dosLar7ff88Wv/euRwPYpAspKlZ+8uvzWix1o3PFyu5YlrSAsrODpt1vk9/tC7vyONbpW+MpN5hkcrnCjLzS5ywe2yX2FlwstDd89EvCTne6HX/aX/90DiE4MeHh95glPm5t7fqWqyBYNa4s+67OGv84FfPlgmUN/6/O4r7ao/zvn+0XjN99/menA48kv/C9hIuRG4TswuaPvK17YbT4NeDaAdwE/uPADGtMPV3VNuuwTzfv8YUbzw1mffxrFdX/X5cH/TPCXA9pHQq7Ycdzxg9sMrBCXNZ5jpMyDQRHqKcV9a1MP/fygf/HCmJuUardaDM2yqiqkoalO+1y3EXD9IMTzFH7FJ1tIiHQKqdCZN1z5rwl/+GWfqKKY3RUEheIkzXt64abl6q2BX5orh+Wr4wMlUKGCqoaZMt5CHVUyJO2EfLODF+dQUtgSeL7H5X4VQS6Id0o4gAOuGJavCWD2G3MIBSiFGAWeQrRGygGqXoIhWHuFx9+pwkkAB9YzlIJMn4SXCTxFmNFmH4ApKVXCAVYgH1uSDNcejJ/7KZLZwoLkbvw9inIuoECGhglCSIFYhIE4H8A0rdtdzlklFlQkSD9HBTHWOZTWSJpDO0H1LcQCiYCVERg1AU9aJwgRMED4n827AOZ3efLrC2bBRaQn2HaGNuDsMCxHlMLlDgq4a2fQdhAJOBA1BmeT1hHD1kJfHD3n+FUa/xbAfDmOPnvrSv2O0negwUqOShwq9MBTkDskLty20BRcIghCJpw0HQzBhZ2li9DKUr4fDz4zCeh/7odp/N3LB6Ur03GQgnQtEqoTA4hB+oIkQgYjeMKkNePWXWfp2Jx2nvHrOPrRr7Pk0wAK4CrFlnrX3MrHpjxvGgAP0JOvRRAL1o3hyaR1xLCxG8HbtoC7bNR8LYk7n8iy2wJfOsXF7o7Vxj1eOr3w+lCpEsJIMrKQAhlCDEQiI/ecK2xpuXHrVhKzlSXZ16x9MPDm071c36Rcu9XTp+ZecNj4xxyQTxYxnrTuU1gsPetonwDOEpppwj/z/G8/FnkS8MEzveEcMv7R+9amH3bdcuWWs57ZOxA32R1CT9x4ngu38rQAx/w3zf73B3Gf+BO8Cvjj6d9wTkdHjH+BS4Wla1zQhFde0PqCGuaK9n4zy9LNLGn+O0//8A/rvrsG3wB+xxno/+N5rMoDguFXAAAAAElFTkSuQmCC";
                } else if (data.tomatoImage === "rotten") {
                    tomatoimg = "iVBORw0KGgoAAAANSUhEUgAAABgAAAAYCAYAAADgdz34AAAFZ0lEQVR4Ac1UA5Qj7RYMhwjGtk10upOsbTtr28YoM6uxbRtr29Zv22a9O3q265w6za+uwPtr0Jfo+npGWmuDBzsUmDmYTOYL+GLevwsSCwNmbVzQq02XGbRcZZBWF/VDgMoumc/ni/51dT5PMGK2e8uJ+yR+TYHGSyw6bjI4Uhn9i8zGaNi/rC/SEZqu14a+X3eRRWEnsYNFEV2zmxVwCTRf+fv/CsVCqaFcP5zS6ScQ8vX+qrCugdhW31jHpfvHiUt8LpWdYJHZqEBmgwLZTQoklSpg5Sqd1v+/qZ3xcM3G0GuZdWO+0BYM/yh0iFO+SFdo9mfFnfzMVmw7EvLGnszwDwKUtomWzpJpuzKivslq4nC4gkV6HYcFO0Le0zEQ2/MIBjK9wPXaqPcbLo6hGo3H2YfTUXFyAryibVP+RNzS0WRIZn3El513GFSeY5Fcx/5q7iSZbOYombJOG/nN0SolDpVzCB7kkNt/xj3Mam9KtZLqokRqjRpZTYNRc3Ykxi8JfC4QCoz/wECI0mpj01UFyk+zyGjhkNKoQuQo57Ie426yhTvSGRJRImK4U1FPjcRCySiN14XDFRwSilloiXRFer0KU9YEfUx1sfnD9PjI55SdYlByksORWhZJ5PHymIiPKYopcnuTieuTon44WsVhV2b096M1nicmL/O9ElvA/qIt5ZBUxuJgGaWxkkgRRY/1eEbz8ocRiPVEVpOW+1zKP9brfWwJBy0d2put+GVnGvNrQhGLeGJiCQvyGgeJ9B1JNSpoy5WIp/9jCllM3xAKmbXxvj8/tdQ9oUMcMpfFhn+SSIdIDIml5F05RwIs4sjb35LEY4hT14ciYqTHNz6MwzOXQOsrEkvDWPJewvtroC6xDVDbpx8oYn89VMshsYolT8nbavK8pptKpDQpsSE5Guau8nahjtCFz+cJe8bzr4EicLawN2KlFgbBFtSiW1Ijv87q4JDazCGtpY/NbM81o40MVzJQTHA7ae4snSqxMlLrmeh6UfcY/NnF4BxovnZ5TMhre3Iiv9qaFvHpgaLo7zNau0XZPnJIb+0mS+IsyDByqV5ZnQrElDDYmBL5w+xtQW+rpnlesPSQL/+DiZbbGY/clhb+Sd7xnoPE3mtmO4ucrl5vM0k0u5Mj0to4zaH8ghJVl1WouqRG3dXBaLk1DJ33RuH4gwlIrh4OP7VDqUDUF03wEMei5AYFCfaIEVnkHe8VyyCPS86qUHpWjfLzA9F4YyjiC5U/RI5wur5iT8T7px9NxenHM3DmyWycfzYXF15ocOe1xcisHQtbP/NtNO2hPEtX6ZyY4sivKy5wKD6jQs1lNfI6VVBO9bjoq7TPT6sf/N3Jx5Nw/P5UXH5pDtbsY94X6QlDdQzF0Zu0qvdvv7oYF19aiEsvLcD55wt6ruceaDBoms81O1/z/bzu/R400P5o0fEhaL89FmUnR4MZ59ZG3SEX6Yls1sYwL918ZSF5Nx/XX1mEmhNTYOko2csjWHuaripun4irLy9A15056LgxG81XZhCnY8zCwFfdI2xo8gnd+bJykU4KG+gQa+9lqhGKBEa9q1hgsmBz+PUbJHz2iQZnHmsoCg0mzA19nb65dDvHjHPvKOmaiOKuSUij1CRXjcburEHwYR0vmzlIdvH+FlQTPKpPPZiD1qszUHd+CkU5HbNWRf1I0z+gp72pPQfO8Lm3PFaBRfsZTN8agbCRbu/pGekMobY1/5sGTCwN1Uv2Mh/HFQ3r8WzO+mjYeZi108TKfn84bbzNdjr4W5abOUgTxboiP94/AjIyyD3KrtMl2OaWsZnBnh7P/p0QUcGltiarjC0MD4j1hNG8/yf8BrCAoJdN16WUAAAAAElFTkSuQmCC";
                }
                sectl.append("<br><span style='background:url(data:image/png;base64," + tomatoimg + ") no-repeat; background-size: cover; width: 24px; height: 24px; vertical-align: middle; display: inline-block'></span><span style='font-size: 14px; vertical-align: middle; display: inline-block; line-height: 24px; padding-left: 6px'>" + data.tomatoMeter + "%</span>");
            }
        });
    } else if (host === "www.imdb.com") {
        var starbox = $(".star-box-details");
        if (starbox) {
            var id = location.href.match(/tt\d+/);
            $.getJSON("https://api.douban.com/v2/movie/imdb/" + id + "?callback=?", function(data) {
                var url = data.alt.replace('/movie/', '/subject/') + '/';
                starbox.append("<br><a href='" + url + "' target=_blank>Douban</a>: <strong><span itemprop=ratingValue>" + data.rating.average + "</span></strong><span class=mellow>/<span itemprop=bestRating>" + data.rating.max + "</span></span>");
                starbox.append(" from <a href='" + url + "collections' target=_blank><span itemprop=ratingCount>" + data.rating.numRaters.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1,') + "</span> users</a>");
            });
        }
    }
})();