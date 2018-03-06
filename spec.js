describe('JetBlue, Plan A Trip', function(){
    const tripPage = 'https://www.jetblue.com/plan-a-trip/#/';
    const departBox = element(by.id('jbBookerDepart'));
    const arriveBox = element(by.id('jbBookerArrive'));
    const dateDepartBox = element(by.id('jbBookerCalendarDepart'));
    const dateReturnBox = element(by.id('jbBookerCalendarReturn'));
    const adultBox = element(by.id('jbBookerGroup-0'));
    const adultLabel = adultBox.element(by.css('.jbSelectLabel'));
    const childBox = element(by.id('jbBookerGroup-1'));
    const infantBox = element(by.id('jbBookerGroup-2'));
    const errorMessages = element(by.css('div.form_errors_overlay.ng-isolate-scope > div:nth-child(3) > div > div:nth-child(1)'));
    const dateFunctions = require('./functions/dateFunctions.js');

    const clickOption = function(theElement, optionNum){
        theElement.element(by.css('.dropdown')).click().then(function(){
            let theOption = theElement.element(by.css(`div > ol > li:nth-child(${optionNum})`));
            theOption.click();
        });
    };
    // TODO: test defaults of flight fields when page loads.  DONE
    // TODO: select different items in dropdowns and ensure information changes.  DONE
    // TODO: ensure that when invalid destination is entered an error is displayed.  DONE
    // TODO: ensure that when a date that has already passed is entered an error is displayed.  DONE
    // TODO: ensure that when the return date is prior to the departure date an error is displayed.  DONE
    // TODO: if the user selects 1 infant and 0 adults, an error message is displayed.  DONE
    // TODO: if the user selects 0 adults but 1 kid(under 14), a warning is displayed.  DONE
    // TODO: if the user enters correct information the page should redirect.  DONE
    // TODO: if the user clicks the "Services and Fees" option, the legal page should load.  DONE
    // TODO: if the user clicks the 8+ travelers link, a modal appears with information on FAQs  DONE
    // TODO: ensure that the correct page loads with correct airports when information is submitted into flight planning.
    // TODO: add in testing support for Multicity flight planning for both 3 and 4 flights.


    beforeEach(function(){
        browser.get(tripPage);
    });
    
    it('check default values of dropdowns', function(){
        let checkAdult = element(by.css('#jbBookerGroup-0 > div > div'));
        expect(checkAdult.getText()).toContain('1 Adult');

        let checkChild = element(by.css('#jbBookerGroup-1 > div > div'));
        expect(checkChild.getText()).toContain('0 Kids (Under 14)');

        let infantCheck = element(by.css('#jbBookerGroup-2 > div > div'));
        expect(infantCheck.getText()).toContain('0 Lap Infants (Under 2)');
    });
    
    it('should select 2 adults', function(){
       let theCheck = element(by.css('#jbBookerGroup-0 > div > div'));
       clickOption(adultBox, 3);
       expect(theCheck.getText()).toContain('2 Adults');
     });

     it('should select 1 kid under 14', function(){
        let theCheck = element(by.css('#jbBookerGroup-1 > div > div'));
        clickOption(childBox, 2);
        expect(theCheck.getText()).toContain('1 Kid');
      });

      it('should select 1 adult and 1 infant', function(){
        let theCheck = element(by.css('#jbBookerGroup-2 > div > div'));
        clickOption(adultBox, 2);
        clickOption(infantBox, 2);
        expect(theCheck.getText()).toContain('1 Lap Infant');
      });

      it('should select 1 infant and then 0 adults', function(){
        let theCheck = element(by.css('div.inline_error.passanger_error.ng-binding'));
        clickOption(infantBox, 2);
        clickOption(adultBox, 1);
        expect(theCheck.getText()).toContain('Please select more adults or fewer infants.');
      });

      it('should give a warning when 1 kid under 14 and 0 adults are selected', function(){
        departBox.sendKeys('Salt Lake City, UT (SLC)');
        arriveBox.sendKeys('Las Vegas, NV (LAS)');
        dateDepartBox.sendKeys(dateFunctions.getDate(1));
        dateReturnBox.sendKeys(dateFunctions.getDate(5));
        clickOption(adultBox, 1);
        browser.sleep(1000);
        clickOption(childBox, 2);
        browser.sleep(1000);
        element(by.css('input[value="Find it"]')).click().then(function(){
            let theCheck = element(by.css('#jb-overlay-title'));
            expect(theCheck.getText()).toContain('Unaccompanied Minors');
        });
      });

     it('should error if arrival city is not entered', function(){
        element(by.css('input[value="Find it"]')).click().then(function(){
            let errorMessages = element.all(by.repeater('errorMessage in errorMessages')).get(0);
            expect(errorMessages.getText())
            .toContain('Please enter valid arrival city.');
        });
     });

     it('should error if departure city is not entered', function(){
        departBox.clear();
        arriveBox.sendKeys('Las Vegas, NV (LAS)');
        dateDepartBox.sendKeys(dateFunctions.getDate());
        dateReturnBox.sendKeys(dateFunctions.getDate(10));
        element(by.css('input[value="Find it"]')).click().then(function(){
            let errorMessages = element.all(by.repeater('errorMessage in errorMessages')).get(0);
            expect(errorMessages.getText()).toContain("Please enter valid departure city.");
        });
     });

     it('should error if return date is before departure date', function(){
        departBox.sendKeys('Salt Lake City, UT (SLC)');
        arriveBox.sendKeys('Las Vegas, NV (LAS)');
        dateDepartBox.sendKeys(dateFunctions.getDate());
        dateReturnBox.sendKeys(dateFunctions.getDate(-1));
        element(by.css('input[value="Find it"]')).click().then(function(){
            let errorMessages = element.all(by.repeater('errorMessage in errorMessages')).get(0);
            expect(errorMessages.getText()).toContain("Please enter valid return date.");
        });
     });

     it('should input correct information with 1 adult and 0 children with current date and notify only times 1 hour and 30 minutes away will show', function(){
        departBox.sendKeys('Salt Lake City, UT (SLC)');
        arriveBox.sendKeys('Las Vegas, NV (LAS)');
        dateDepartBox.sendKeys(dateFunctions.getDate());
        dateReturnBox.sendKeys(dateFunctions.getDate(10));
        clickOption(adultBox, 2);
        element(by.css('input[value="Find it"]')).click();
        
        let warning = element(by.css('div.form_errors_overlay.ng-isolate-scope > div:nth-child(4) > div > div:nth-child(1)'));
        expect(warning.getText())
        .toContain("Because you've selected today's date, only flights that leave at least 1 hours and 30 minutes from the current time will be shown on the next page.");
     });

     it('should accept correct information and redirect to another page', function(){
        departBox.sendKeys('Salt Lake City, UT (SLC)');
        arriveBox.sendKeys('Las Vegas, NV (LAS)');
        dateDepartBox.sendKeys(dateFunctions.getDate(1));
        dateReturnBox.sendKeys(dateFunctions.getDate(10));
        clickOption(adultBox, 2);
        element(by.css('input[value="Find it"]')).click().then(function(){
            expect(browser.getCurrentUrl()).not.toContain(tripPage);
        });
     });

    it('should go to the services and fees page when link is clicked', function(){
        element(by.css('div.jbBooker.mini > form > li > a')).click().then(function(){
        expect(browser.getCurrentUrl()).toContain('https://www.jetblue.com/legal/fees/');
        });
    });

    it('should click on the FAQs link and popup with FAQ information', function(){
        element(by.css('div.jbBooker.mini > form > div.additionalInfo > ul > li:nth-child(3) > a'))
        .click().then(function(){
            let popup = element(by.css('#jb-overlay-title'));
            expect(popup.getText()).toContain('FAQs');
        })
    });

}); // end describe
