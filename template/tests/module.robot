*** Settings ***
Documentation     Test Module
Resource          resource.robot
Suite Setup       Open Module
Suite Teardown    Close Browser

*** Variables ***


*** Test Cases ***
View Module
    Module Should Be Open
