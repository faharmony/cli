*** Settings ***
Library    SeleniumLibrary    timeout=10    implicit_wait=0

*** Variables ***
${APP NAME}          FA App
${MODULE NAME}       {{properCase moduleId}}
${MODULE ID}         {{lowerCase moduleId}}
${SERVER}            localhost:3000
${BROWSER}           chrome
${DELAY}             0
${VALID USER}        admin
${VALID PASSWORD}    ke5ku5TA
${LOGIN URL}         http://${SERVER}/
${MODULE URL}        http://${SERVER}/#/${MODULE ID}


*** Keywords ***
Login
    Open Browser               ${LOGIN URL}    ${BROWSER}           
    Maximize Browser Window
    Set Selenium Speed         ${DELAY}
    Sleep                      5
    Title Should Be            Log in to FA
    Input Text                 username        ${VALID USER}
    Input Text                 password        ${VALID PASSWORD}
    Click Button               kc-login

Open Module
    Login
    Sleep            3
    Click Element    id:navPrimaryItem-${MODULE ID}

Module Should Be Open
    Title Should Be    ${APP NAME} - ${MODULE NAME}
