// ==UserScript==
// @name         AAA广东干部学习
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://gbpx.gd.gov.cn/gdceportal/Study/*
// @match        https://*.shawcoder.xyz/*
// @run-at      document-end
// ==/UserScript==

(function() {

    'use strict';
    console.log('start...')

    //课程列表页面
    if(window.location.pathname == '/gdceportal/Study/LearningCourse.aspx'){
        console.log('检测到课程列表页面...')
        var course_link_01 = document.querySelector('#gvList_ctl02_HyperLink2')
        if (course_link_01) {
            setTimeout(open_course_link(),3000)
        }
    }

    //打开后课程页面
    if(window.location.pathname == '/gdceportal/Study/CourseDetail.aspx'){
        console.log('准备播放视频...')
        var button_start_learn = document.querySelector('#btnStudy')
        if(button_start_learn){
            setTimeout(button_start_learn.click(),3000)
        }
    }

    //视频播放页面
    if(window.location.host == 'wcs1.shawcoder.xyz' & window.location.pathname == '/gdcecw/play_pc/playmp4_pc.html'){
        window.onload=function(){
            console.log('自动播放视频')
            let is_muted = false;
            const k = 20;
            let j = 0;
            while (!is_muted && j < k) {
                sleep(200)
                j = j + 1
                //console.log(j)
                if (document.querySelector('video')) {
                    document.querySelector('video').muted = true;
                    is_muted = true;
                }
            };
            wait_element("#my-video > button",function () {
                setTimeout(function(){
                    document.querySelector("#my-video_html5_api").play()
                },3000)
            })
        }
    }

    function open_course_link(){

        let course_url = 'https://gbpx.gd.gov.cn/gdceportal/Study/'+ course_link_01.href.slice(14,67)
        console.log('已打开页面-> '+course_url)
        let win = window.open(course_url);

        var course_need_time =document.querySelector('#gvList > tbody > tr:nth-child(2) > td:nth-child(2)')
        if (course_need_time){
            let course_percent = parseInt(document.querySelector("#gvList > tbody > tr:nth-child(2) > td:nth-child(5) > div > div:nth-child(2)").textContent)*0.01
            let study_time_hour = parseFloat(course_need_time.textContent)

            //一个学时对应大概42-45min
            let study_time_secend = study_time_hour/60*45*60*60*(1-course_percent)+10

            //let study_time_secend = 10*60
            console.log('此页面刷新时间：'+study_time_secend+'s,当前进度'+course_percent*100+'%')

            sleep(study_time_secend*1000).then(() => {
                console.log('关闭window')
                win.close();

                //延迟重新载入页面
                setTimeout(location.reload(),10000)
            })
        }
    }


    function sleep (time) {
        return new Promise((resolve) => setTimeout(resolve, time));
    }

    /*
    功能:等待dom加载后执行函数
    dom_selector :选择器参数  待加载的dom = document.querySelector(dom_selector)
    func:待执行函数体，用匿名函数传参
    */
    function wait_element(dom_selector, func) {
        let is_DomExist = false;
        let interval = 100;//时间间隔
        var int_checkDom = setInterval(() => {
            if (document.querySelector(dom_selector)) {
                is_DomExist = true;
                func();
            };
            if (is_DomExist) {
                clearInterval(int_checkDom);
            }
        }, interval);
    };

})();
