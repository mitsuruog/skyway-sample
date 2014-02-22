/**
 * Created by mitsuruog on 2014/02/20.
 */

//APIキー
//⬇️http://mitsuruog.github.io/skyway-sample only
var APIKEY = 'd8267064-6c53-11e3-88fb-0bb014558bc5';

//⬇️local host only
//var APIKEY = '6165842a-5c0d-11e3-b514-75d3313b9d05';

//ユーザーリスト
var userList = [];

//Callオブジェクト
var existingCall;

//コネクトユーザ
var userName;

// PeerJSオブジェクト
var peer;

// Compatibility
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;

// イベントハンドラー
$(function() {

    //ユーザ名を登録
    $('#regist-user').click(function() {

        var user = $('#userName').val();
        if (!user) {
            alert('ユーザ名を入力してくだい。');
            return;
        }

        userName = user;
        init();

    });

    // 相手に接続
    $('#make-call').click(function() {
        var call = peer.call($('#contactlist').val(), window.localStream);
        step3(call);

    });

    // 切断
    $('#end-call').click(function() {
        existingCall.close();
        step2();
    });

    // メディアストリームを再取得
    $('#step1-retry').click(function() {
        $('#step1-error').hide();
        step1();
    });


    $('.pure-g').hide();

    // ステップ１実行
    step1();

    //ユーザリス取得開始
    setInterval(getUserList, 2000);

});

function init() {

    if (!userName) {
        alert('ユーザ名が登録されていません。');
        return;
    }

    // PeerJSオブジェクトを生成
    peer = new Peer(userName, {
        key: APIKEY,
        debug: 3
    });

    // PeerIDを生成
    peer.on('open', function() {
        $('#my-id').text(peer.id);
    });

    // 相手からのコールを受信したら自身のメディアストリームをセットして返答
    peer.on('call', function(call) {
        call.answer(window.localStream);
        step3(call);
    });

    // エラーハンドラー
    peer.on('error', function(err) {
        alert(err.message);
        step2();
    });

    $('.pure-h').hide();
    $('.pure-g').show();

}

function step1() {
    // メディアストリームを取得する
    navigator.getUserMedia({
        audio: true,
        video: true
    }, function(stream) {
        $('#my-video').prop('src', URL.createObjectURL(stream));
        window.localStream = stream;
        step2();
    }, function() {
        $('#step1-error').show();
    });
}

function step2() {
    //UIコントロール
    $('#step1, #step3').hide();
    $('#step2').show();
}

function step3(call) {
    // すでに接続中の場合はクローズする
    if (existingCall) {
        existingCall.close();
    }

    // 相手からのメディアストリームを待ち受ける
    call.on('stream', function(stream) {
        $('#their-video').prop('src', URL.createObjectURL(stream));
    });

    // 相手がクローズした場合
    call.on('close', step2);

    // Callオブジェクトを保存
    existingCall = call;

    // UIコントロール
    $('#their-id').text(call.peer);
    $('#step1, #step2').hide();
    $('#step3').show();

}

function getUserList() {
    //ユーザリストを取得
    $.get('https://skyway.io/active/list/' + APIKEY,
        function(list) {
            for (var cnt = 0; cnt < list.length; cnt++) {
                if ($.inArray(list[cnt], userList) < 0 && list[cnt] != peer.id) {
                    userList.push(list[cnt]);
                    $('#contactlist').append($('<option>', {
                        "value": list[cnt],
                        "text": list[cnt]
                    }));
                }
            }
        }
    );
}