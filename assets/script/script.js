const key = '';//needs to be hidden before I figure out a way to proxy it

function createSummonerCard() {
    var requestUrl = 'https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-name/'+localStorage.getItem('summoner')+'?api_key='+key;
    fetch(requestUrl)
        .then(function (response) {
            if (response.status === 404) {
                return null;
            } else {
                return response.json();
            }
        })
        .then(function (data) {
            console.log(data);
            if(!data) {
               alert('Please double check the summoner\'s name!');
            }
            localStorage.setItem('accountId', data.accountId);
            localStorage.setItem('summonerId', data.id);
            localStorage.setItem('puuid', data.puuid);
            var icon = $('<img></img>').attr('src', 'http://ddragon.leagueoflegends.com/cdn/12.3.1/img/profileicon/' + data.profileIconId + '.png')
                .css({
                    'max-width': '30%',
                    'margin-right': '10px'
                });
            var name = $('<h3></h3>').text(data.name).addClass('card-title');
            var level = $('<p></p>').text('Level '+ data.summonerLevel).addClass('card-text');
            
            var body = $('<div></div').attr('id', 'summoner-info');
            body.append(icon, name, level).addClass('card-body');
            $('#summoner-info').append(body);

            getSummonerRankInfo(data.id);
        })
}

function getSummonerRankInfo(id) {
    var requestUrl = 'https://na1.api.riotgames.com/lol/league/v4/entries/by-summoner/'+id+'?api_key='+key;
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then (function (data) {
            console.log(data);
            if  (data.length===1 && data[0].queueType!== 'RANKED_TFT_PAIRS' ) {
                var icon = $('<img></img>').attr('src', showRankIcon(data[0].tier))
                    .css({
                        'max-width': '100%',
                        'min-width': '100%',
                        'alt': data[0].tier
                    });
                if (data[0].tier === 'MASTER' || data[0].tier === 'GRANDMASTER' || data[0].tier === 'CHALLENGER') {
                    var SRRank = $('<p></p>').text(getSRQueueType(data[0].queueType)+ ': ' + data[0].tier).addClass('card-text');
                } else {
                    var SRRank = $('<p></p>').text(getSRQueueType(data[0].queueType)+ ': ' + data[0].tier + ' ' +data[0].rank).addClass('card-text');
                }
                var history = $ ('<span></span>').text(data[0].wins + ' wins & ' + data[0].losses + ' losses this season.  ').addClass('card-text')
                    .css({
                        'margin': '0'
                    });
                var hotStreak = $('<span></span>').text(getHotStreak(data[0].hotStreak)).addClass('card-text')
                    .css({
                        color: colorHotStreak(data[0].hotStreak),
                        'font-weight': 'bold'
                    });
            } else if (data.length===0 || data[0].queueType==='RANKED_TFT_PAIRS' ) {
                var icon = $('<img></img>').attr('src', './assets/image/Bee_Sad_Emote.png')
                    .css({
                        'max-width': '100%',
                        'min-width': '100%',
                        'alt': 'This player is unranked'
                    });
                var SRRank = $('<p></p>').text('Unranked in Summoner\'s Rift!').addClass('card-text');
                var history = $ ('<span></span>').text('Didn\'t rank in this season? :)').addClass('card-text');   
                        }
            var mode = $('<img></img>').attr('src', './assets/image/Summoners_Rift_Icon.png')
                .css({
                    'max-width': '8%',
                    'margin-right': '15px'
                });
            $('#rank-container').append(icon, SRRank);
            var body = $('<div></div>');
            body.append(mode, history, hotStreak);
            $('#honors').append(body);
            getSummonerTFTInfo(localStorage.getItem('summonerId'));
        })
}

function getSRQueueType(queue) {
    if (queue === 'RANKED_SOLO_5x5') {
        return 'Ranked Solo/Duo';
    } else if (queue === 'RANKED_TEAM_5x5') {
        return 'Ranked Flex';
    } else {
        return 'Unranked in Summoner\'s Rift!';
    }
}

function getHotStreak(data) {
    if (data) {
        return ' In a Hot Streak! :D \n 还不快c板栗?';
    } else {
        return ' Not in a Hot Streak :( \n 有点菜呀!'
    }
}

function colorHotStreak(data) {
    if (data) {
        return '#fa116e';
    } else {
        return '#10871a';
    }
}

function storeSearch() {
    localStorage.setItem('summoner', $('#search-input').val());
}

$(document).ready(function() {
    $('#search-button').on('click', function(event) {
        event.preventDefault();
        storeSearch();
        window.location = './userPage.html';
    });
});

function showRankIcon(rank) {
    if (rank==='IRON') {
        return './assets/image/Emblem_Iron.png';
    } else if (rank==='BRONZE') {
        return './assets/image/Emblem_Bronze.png';
    } else if (rank==='SILVER') {
        return './assets/image/Emblem_Silver.png';
    } else if (rank==='GOLD') {
        return './assets/image/Emblem_Gold.png';
    } else if (rank==='PLATINUM') {
        return './assets/image/Emblem_Platinum.png';
    } else if (rank==='DIAMOND') {
        return './assets/image/Emblem_Diamond.png';
    } else if (rank==='MASTER') {
        return './assets/image/Emblem_Master.png';
    } else if (rank==='PLATINUM') {
        return './assets/image/Emblem_Platinum.png';
    } else if (rank==='MASTER') {
        return './assets/image/Emblem_Master.png';
    } else if (rank==='GRANDMASTER') {
        return './assets/image/Emblem_Grandmaster.png';
    } else if (rank==='CHALLENGER') {
        return './assets/image/Emblem_Challenger.png';
    } 
}

function getSummonerTFTInfo(id) {
    var requestUrl = 'https://na1.api.riotgames.com/tft/league/v1/entries/by-summoner/' + id + '?api_key=' + key;
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            if  (data.length!==0) {
                var icon = $('<img></img').attr('src', showRankIcon(data[0].tier))
                    .css({
                        'max-width': '100%',
                        'min-width': '100%',
                        'alt': data[0].tier
                    });
                if (data[0].tier === ('MASTER' || 'GRANDMASTER' || 'CHALLENGER')) {
                    var TFTRank = $('<p></p>').text('TFT Ranked: ' + data[0].tier).addClass('card-text');
                } else {
                    var TFTRank = $('<p></p>').text('TFT Ranked: ' + data[0].tier + ' ' +data[0].rank).addClass('card-text');
                }
                var history = $ ('<span></span>').text('哇! 这赛季吃了' + data[0].wins + '次鸡呢!').addClass('card-text');
            } else {
                var icon = $('<img></img>').attr('src', './assets/image/Star_Guardian_Towa_Emote.png')
                    .css({
                        'max-width': '100%',
                        'min-width': '100%',
                        'alt': 'This player is unranked'
                    });
                var TFTRank = $('<p></p>').text('Unranked in TFT!').addClass('card-text');
                var history = $ ('<span></span>').text('Oops, never tried?? :)').addClass('card-text');      
            }
            var mode = $('<img></img>').attr('src', './assets/image/Teamfight_Tactics_Icon.png')
                .css({
                    'max-width': '8%',
                    'margin-right': '15px'
                });
            $('#tft-rank-container').append(icon, TFTRank);
            var body = $('<div></div').attr('id', 'summoner-tft-info');
            body.append(mode, history);
            $('#honors').append(body);
        })

}

function getRecentMatch() {
    var requestUrl = 'https://americas.api.riotgames.com/lol/match/v5/matches/by-puuid/' + localStorage.getItem('puuid') + '/ids?endTime=' + moment().unix().toString() + '&start=0&count=20&api_key=' + key;
    console.log('0');
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log(data);
            data.sort();
            data.reverse();
            console.log(data);
            for (var i=0; i<data.length; i++) {
                printRecentMatch(data[i]);
            }
        })
}

function printRecentMatch(id) {
    var requestUrl = 'https://americas.api.riotgames.com/lol/match/v5/matches/' + id + '?api_key=' + key;
    console.log(requestUrl);
    fetch(requestUrl)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            var i=0;
            var row = $('<div></div>').addClass('row card-body')
                .css({
                    'min-height': '170px',
                    'max-height': '170px'
                });
            $('#match-container').append(row);
            var index = getSummonerMatchIndex(data.info.participants);

            //
            var championCell = $('<div></div>').addClass('championCell flex-wrap justify-content-center align-items-center p-0 m-0')
                .css({
                    'width': '15%',
                    'max-width': '132px',
                    'margin': '0'
                });
            var championIcon = $('<img></img>').attr('src', getChampionIcon(data.info.participants[index].championName))
                .css({
                    'width': '70%',
                });
            var spell1 = $('<img></img>').attr('src', 'http://ddragon.leagueoflegends.com/cdn/12.3.1/img/spell/Summoner' + getSummonerSpell(data.info.participants[index].summoner1Id) + '.png')
                .css({
                    'width': '35%'
                });
            var spell2 = $('<img></img>').attr('src', 'http://ddragon.leagueoflegends.com/cdn/12.3.1/img/spell/Summoner' + getSummonerSpell(data.info.participants[index].summoner2Id) + '.png')
                .css({
                    'width': '35%'
                });
            championCell.append(championIcon, spell1, spell2);
            //
            var resultCell = $('<div></div>').addClass('resultCell d-flex flex-wrap justify-content-center align-items-center text-center')
                .css({
                    'width': '14%'
                });
            var resultList = $('<ul></ul>')
                .css({
                    'list-style-type': 'none',
                    'padding': '0'
                });
            var matchResult = $('<li></li>').text(getMatchResult(data.info.participants[index].win))
                .css({
                    'color': colorMatchResult(data.info.participants[index].win),
                });
            var queueType = $('<li></li>').text(data.info.gameMode);
            var time = $('<li></li>').text(moment().to(moment(data.info.gameEndTimestamp)));
            var length = $('<li></li>').text(moment(data.info.gameEndTimestamp).to(moment(data.info.gameStartTimestamp), true));
            resultList.append(matchResult, queueType, time, length);
            resultCell.append(resultList);
            //
            var kdaCell = $('<div></div>').addClass('kdaCell d-flex flex-wrap justify-content-center align-items-center text-center')
                .css({
                    'width': '14%'
                });
            var kdaList = $('<ul></ul>')
                .css({
                    'list-style-type': 'none',
                    'padding': '0'
                });
            var kdaRow = $('<li></li>').addClass('mw-100');
            var kills = $('<span></span>').text(data.info.participants[index].kills).css('color', '#77a360');
            var separator1 = $('<span></span>').text('/');
            var deaths = $('<span></span>').text(data.info.participants[index].deaths).css('color', '#d95b55');
            var separator2 = $('<span></span>').text('/');
            var assists = $('<span></span>').text(data.info.participants[index].assists).css('color', '#f5bf42');
            var kda = $('<li></li>').text('KDA: ' + data.info.participants[index].challenges.kda.toFixed(1));
            var killParticipation = $('<li></li>').text('KP: ' + (100*(data.info.participants[index].challenges.killParticipation)).toFixed(1)+'%');
            var cs = $('<li></li>').text('CS: ' + data.info.participants[index].totalMinionsKilled);
            kdaRow.append(kills, separator1, deaths, separator2, assists);
            kdaList.append(kdaRow, kda, killParticipation, cs);
            kdaCell.append(kdaList);
            //
            var itemCell = $('<div></div>').addClass('itemCell col-2 flex-wrap justify-content-center align-items-center')
                .css({
                    'width': '20%'
                });
            var itemArr = [data.info.participants[index].item0, data.info.participants[index].item1, data.info.participants[index].item2, data.info.participants[index].item3, data.info.participants[index].item4, data.info.participants[index].item5, data.info.participants[index].item6];
            for (var i=0; i<itemArr.length; i++) {
                if (itemArr[i]!==0){
                    var item = $('<img></img>').attr('src', 'http://ddragon.leagueoflegends.com/cdn/12.3.1/img/item/' + itemArr[i] + '.png')
                        .css({
                            'width': '32%',
                            'margin': '1px',
                            'height': 'max-content'
                        });
                    itemCell.append(item);
                }
            }
            //
            var blueTeamCell = $('<div></div>').addClass('blueTeamCell flex-column justify-content-center align-items-center')
                .css({
                    'width': '17%',
                    'padding-right': '0'
                });
                for (var i=0; i<5; i++) {
                    var positionIndex = 30*i+3;
                    var teamRow = $('<div></div>')
                        .css({
                            'position': 'relative',
                            'top': positionIndex.toString() + 'px'
                        });
                    var name = $('<p></p>').text(data.info.participants[i].summonerName).addClass('px-0 text-nowrap text-truncate')
                        .css({
                            'font-size': 'small',
                            'position': 'absolute',
                            'right': '32px'
                        });
                    var icon = $('<img></img>').attr('src', getChampionIcon(data.info.participants[i].championName)).addClass('px-0')
                        .css({
                            'width': '30px',
                            'height': '30px',
                            'position': 'absolute',
                            'right': '0',
                        });
                        teamRow.append(name, icon);
                    blueTeamCell.append(teamRow);
                }
            //
            var redTeamCell = $('<div></div>').addClass('redTeamCell flex-column justify-content-center align-items-center')
                .css({
                    'width': '17%',
                    'padding-left': '0'
                });
                for (var i=5; i<10; i++) {
                    var positionIndex = 30*(i-5)+3;
                    var teamRow = $('<div></div>')
                        .css({
                            'position': 'relative',
                            'top': positionIndex.toString() + 'px'
                        });
                    var name = $('<p></p>').text(data.info.participants[i].summonerName).addClass('px-0 text-nowrap text-truncate')
                        .css({
                            'font-size': 'small',
                            'position': 'absolute',
                            'left': '32px'            
                        });
                    var icon = $('<img></img>').attr('src', getChampionIcon(data.info.participants[i].championName)).addClass('px-0')
                        .css({
                            'width': '30px',
                            'height': '30px',
                            'position': 'absolute',
                            'left': '0',
                        });
                    teamRow.append(icon, name);
                    redTeamCell.append(teamRow);
                }
            row.append(championCell, resultCell, kdaCell, itemCell, blueTeamCell, redTeamCell);
        })
}

function getChampionIcon(data) {
    var source = 'http://ddragon.leagueoflegends.com/cdn/12.3.1/img/champion/'+data+'.png';
    return source;
}

function getSummonerMatchIndex(data) {
    for (var i=0; i<data.length; i++) {
        if(data[i].puuid===localStorage.getItem('puuid')) {
            return i;
        }
    }
}

function getMatchResult(data) {
    if (data) {
        return 'Victory';
    } else {
        return 'Defeat';
    }
}

function colorMatchResult(data) {
    if (data) {
        return 'blue';
    } else {
        return 'red'
    }
}

function getSummonerSpell(data) {
    if (data===21) {
        return 'Barrier';
    } else if (data===1) {
        return 'Boost';
    } else if (data===14) {
        return 'Dot';
    } else if (data===3) {
        return 'Exhaust';
    } else if (data===4) {
        return 'Flash';
    } else if (data===6) {
        return 'Haste';
    } else if (data===7) {
        return 'Heal';
    } else if (data===13) {
        return 'Mana';
    } else if (data===30) {
        return 'PoroRecall';
    } else if (data===31) {
        return 'PoroThrow';
    } else if (data===11) {
        return 'Smite';
    } else if (data===39) {
        return 'SnowURFSnowball_Mark';
    } else if (data===32) {
        return 'Snowball';
    } else if (data===12) {
        return 'Teleport';
    } else if (data===54) {
        return '_UltBookPlaceholder';
    } else if (data===55) {
        return '_UltBookSmitePlaceholder';
    }
}

createSummonerCard();
getRecentMatch();
