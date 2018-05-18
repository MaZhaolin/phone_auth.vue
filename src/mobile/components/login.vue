<div class="m-dz m-dz-login">
    <div class="m-dz-top">
            <span class="logo-img fl iconfont redirect-back ">&#xe7c2;</span>
        <span class="logo-text">{lang phone_auth:login}</span>
    </div>
    <div class="m-dz-main">
        <div class="dz-item-group">
            <input class="form-control dz-input dz-input-icon" name="user" type="text" placeholder="{lang phone_auth:account_placeholder}" />
            <span class="iconfont form-icon icon-phone">&#xecc8;</span>
        </div>
        <div class="dz-item-group">
            <input maxlength="20" class="form-control dz-input dz-input-icon" name="password" type="password" placeholder="{lang panel_login_password}" />
            <span class="iconfont form-icon">&#xe6c5;</span>
        </div>
        {if $params['login_captcha'] == '1'}
        <div class="dz-item-group">
            <input type="hidden" name="vaptcha_token">
            <input type="hidden" name="vaptcha_challenge">
            <div class="vaptcha_container">
                <div class="vaptcha-init-main">
                    <div class="vaptcha-init-loading">
                        <a><img src="https://cdn.vaptcha.com/vaptcha-loading.gif"/></a>
                        <span class="vaptcha-text"><a href="https://www.vaptcha.com/" title="{lang phone_auth:captcha}" target="_blank">{lang phone_auth:captcha}</a>{lang phone_auth:captcha_loading}</span>
                    </div>
                </div>
            </div>
        </div> 
        {/if}
        <div class="dz-item-group">
            <button class="btn dz-btn login-btn" disabled>{lang phone_auth:login}</button>
        </div>
        <div class="dz-item-group">
            <a class="dz-link fl redirect-forgetword" href="javascript:;">{lang phone_auth:forgot_password}?</a>
            <a class="dz-link fr redirect-register" href="javascript:;">{lang phone_auth:register_link}</a>
        </div>
        {if $params['qq_login'] == '1' || $params['wechat_login'] == '1' }
            <div class="dz-quick">
                <span class="dz-quick-line fl"></span>
                <span class="dz-quick-text">{lang phone_auth:login_method}</span>
                <span class="dz-quick-line fr"></span>
            </div>
            <div class="dz-qq-wechart">
                {if $params['qq_login'] == '1' }
                <div class="dz-qq-item">
                    <a href="{$params['qq_login_url']}&mobile=yes" class="iconfont dz-qq">&#xe623;</a>
                </div>
                {/if}
                {if $params['wechat_login'] == '1' }
                <div class="dz-wechart-item">
                    <a href="{$params['wechat_login_url']}&mobile=yes" class="iconfont dz-wechart">&#xe66a;</a>
                </div>
                {/if}
            </div>
        {/if}
        <div class="switch-cont">
            <div class="switch-way">
                <a class="way-text" href="{$site_url}/forum.php?mobile=yes">{lang homepage}</a><span class="way-line"></span>
                <a class="way-text" href="#login">{lang login}</a><span class="way-line"></span>
                <a class="way-text" href="#register">{lang phone_auth:register}</a>
            </div>
            <div class="switch-way">
                <a class="way-text" href="{$site_url}/forum.php?mobile=yes&simpletype=no">{lang no_simplemobiletype}</a><span class="way-line"></span>
                <!--{if floatval(substr(DISCUZ_VERSION, 1)) > 3}-->             <a class="way-text" href="{$site_url}/forum.php?mobile=2" disabled>{lang mobile2version}</a><span class="way-line"></span>                     <!--{else}-->             <a class="way-text" href="{$site_url}/forum.php?mobile=yes&simpletype=yes" disabled>{lang simplemobiletype}</a><span class="way-line"></span>         <!--{/if}-->
                <a class="way-text" href="{$site_url}/forum.php?mobile=no">{lang nomobiletype}</a></span>

            </div>
            <div class="switch-way">
                <span class="way-text way-copy" disabled>Copyright © 2017 VAPTCHA All Rights Reserved</span>
            </div>
        </div>
    </div>
</div>