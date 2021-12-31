// ==UserScript==
// @name         A广东干部学习[无弹窗]
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://gbpx.gd.gov.cn/*
// @match        https://*.shawcoder.xyz/*
// @grant        unsafeWindow
// @grant        GM_openInTab
// @run-at       document-start


// ==/UserScript==

(function() {

    const AUTO_REFRESH_TIME = 300

    'use strict';

    //取消alert弹窗
    unsafeWindow.alert = function(){return false};
    window.alert = function(){return false};
    Window.prototype.alert = function(){return false};


    //列表页一级页面
    if(window.location.pathname == '/gdceportal/Study/StudyCenter.aspx'){
        sleep(AUTO_REFRESH_TIME*1000).then(() => {
            //location.reload(true)
        })
    }

    //课程列表页面
    if(window.location.pathname == '/gdceportal/Study/LearningCourse.aspx'){
        //console.log('检测到课程列表页面...')
        var selector_course = '#gvList_ctl02_HyperLink2'
        wait_element(selector_course,function(){
            setTimeout(do_study(selector_course),3000)
        })
    }

    //打开后课程页面

    if(window.location.pathname == '/gdceportal/Study/CourseDetail.aspx'){
        //console.log('准备播放视频...')
        var selector_start_button = '#btnStudy'
        wait_element(selector_start_button,function(){
            document.querySelector(selector_start_button).click()
        })
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

    function do_study(selector){

        let course_link = document.querySelector(selector)
        //第一个课程变色
        document.querySelector("#gvList > tbody > tr:nth-child(2)").style.backgroundColor = "yellow"
        document.querySelector("#gvList > tbody > tr:nth-child(2)").style.color = "red"
        //document.querySelector("#gvList_ctl02_HyperLink1").innerText = '**学习中**'

        //拼接课程视频页面url
        //console.log('已打开页面-> '+course_url)
        //let course_url = 'https://gbpx.gd.gov.cn/gdceportal/Study/'+ course_link.href.slice(14,67)


        //拼接跳转后的地址
        let cid = course_link.href.slice(14+21,67)
        let course_url = 'https://wcs1.shawcoder.xyz/gdcecw/play_pc/playverif_pc.html?t=2f4fd72bdf4a421f8e83d72060c414f5&courseLabel=wlxy&courseId='+cid

        var body = document.getElementsByTagName("body");
        var div = document.createElement("div");
        div.innerHTML = '<iframe id="auto_gbpx" name="auto_gbpx" src="'+course_url+'" height = "0" width = "0" frameborder="0" scrolling="auto" style = "display:none;visibility:hidden" ></iframe>';
        document.body.appendChild(div);

        //处理主页面等待刷新时间
        var course_need_time =document.querySelector('#gvList > tbody > tr:nth-child(2) > td:nth-child(2)')
        if (course_need_time){
            let course_percent = parseFloat(document.querySelector("#gvList > tbody > tr:nth-child(2) > td:nth-child(5) > div > div:nth-child(2)").textContent)*0.01
            let study_time_hour = parseFloat(course_need_time.textContent)

            //一个学时对应大概42-45min
            let study_time_second = parseInt(study_time_hour/60*45*60*60*(1-course_percent))+10
            let refresh_time_second = AUTO_REFRESH_TIME

            console.log('当前课程剩余：'+study_time_second+'s  当前进度：'+course_percent*100+'%')
            if(study_time_second<refresh_time_second){
                refresh_time_second = study_time_second
            }

            //页面显示刷新倒计时
            let last_time = refresh_time_second
            setInterval(function(){
                document.querySelector("#gvList_ctl02_HyperLink1").innerText = ''+last_time+'s刷新';
                last_time += -1;
            },1000);

            sleep(refresh_time_second*1000).then(() => {
                //console.log('移除iframe')
                //document.querySelector('iframe#auto_gbpx').remove()
                location.reload(true)

            })
        }
    }


    function sleep (time_ms) {
        return new Promise((resolve) => setTimeout(resolve, time_ms));
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
