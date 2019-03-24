let socketKey = "fj3Dk83A9fGr4Dc2";
let uluru, map, marker
let ws;
let players = {}
let nick = '1'
let begForLocation = document.querySelector('.beg-for-location')
let guid = parseInt(Date.now() + Math.random() * 1000)
let icon = guid % 5

let chatNick, chatContent, chatMessages, chatForm

ws = new WebSocket("ws://91.121.6.192:8010")

function initMap()
{
    uluru = { lat: -25.363, lng: 131.044 }
    map = new google.maps.Map(document.getElementById('map'),{
        zoom: 12,
        center: uluru,
        keyboardShortcuts: false
    });
    marker = new google.maps.Marker({position: uluru, map: map, icon: iconString(icon)});

    initChat()
}

function initChat()
{
    chatNick = document.querySelector('#nick')
    chatContent = document.querySelector('#content')
    chatMessages = document.querySelector('#messages')
    chatForm = document.querySelector('#form')
    chatForm.addEventListener('submit', function(e){
        e.preventDefault()
        sendChatMessage()
    })
}

function getLocalization()
{
    navigator.geolocation.getCurrentPosition(geoOk, geoFail)
}

function geoOk(data)
{
    begForLocation.classList.remove('beg-for-location--visible');
    let coords = {
        lat: data.coords.latitude,
        lng: data.coords.longitude
    };
    placeMyMarker(coords, 'new')

}

function geoFail(data)
{
    begForLocation.classList.add('beg-for-location--visible');
}

function watchKeys()
{
    document.addEventListener('keydown', moveMarker)
}

function moveMarker(e)
{
    let coords = { 
        lat: marker.getPosition().lat(),
        lng: marker.getPosition().lng()
    }

    switch(e.key)
    {
        case 'ArrowUp':
            coords.lat += 0.001
            break;
        case 'ArrowDown':
            coords.lat -= 0.001
            break;
        case 'ArrowLeft':
            coords.lng -= 0.001
            break;
        case 'ArrowRight':
            coords.lng += 0.001
            break;
        default:
            break;
    }
    placeMyMarker(coords, 'move')
}

function placeMyMarker(_coords, _action)
{
    marker.setPosition(_coords)
    map.setCenter(_coords)

    let me = {
        id: guid,
        action: _action,
        coords: _coords,
        playericon: icon
    }

    sendMessage(me)
}

function sendMessage(obj)
{
    ws.send(socketKey + JSON.stringify(obj))
}

function receiveMessage(msg)
{
    if(msg.substring(0, socketKey.length) == socketKey)
    {
        msg = msg.substring(socketKey.length)
        msg = JSON.parse(msg)
        
        if(msg.id != guid)
        {
            if(msg.action == 'new')
            {
                players[msg.id] = new google.maps.Marker({position: msg.coords, map: map, icon: iconString(msg.playericon)});
            }
            if(msg.action == 'move')
            {
                if(players[msg.id])
                    players[msg.id].setPosition(msg.coords);
                else
                    players[msg.id] = new google.maps.Marker({position: msg.coords, map: map, icon: iconString(msg.playericon)});
            }
            if(msg.action == 'close')
            {
                players[msg.id].setMap(null)
            }
            if(msg.action == 'chat')
            {
                showMessage(msg)
            }
        }
    }
}

getLocalization()

watchKeys()

ws.onmessage = function(e) 
{ 
    let msg = e.data
    receiveMessage(msg)
};

window.onbeforeunload = function(e)
{
    sendMessage({
        id: guid,
        action: 'close'
    });
}

function iconString(number)
{
    return `icon/${number}.png`
}

function sendChatMessage()
{
    let msg = {
        id: -1,
        nick: chatNick.value,
        content: chatContent.value,
        time: new Date(),
        action: 'chat'
    }

    if(msg.nick.length > 0 && msg.content.length > 0)
    {
        chatContent.value = ''
        sendMessage(msg)
    }
}

function showMessage(msg)
{
    let messageDOMObject = 
    `<div class="message">
        <div class="message__header">
            <div class="message__nick">${msg.nick}</div>
            <div class="message__time">(${msg.time})</div>
        </div>
        <div class="message__content">${msg.content}</div>
    </div>`
    chatMessages.innerHTML = messageDOMObject + chatMessages.innerHTML
}