//
//  SWNoiseViewController.m
//  LEDControl
//
//  Created by Chad Berkley on 8/13/14.
//  Copyright (c) 2014 Chad Berkley. All rights reserved.
//

#import "SWNoiseViewController.h"
#import "SWLEDController.h"

@interface SWNoiseViewController ()

@end

@implementation SWNoiseViewController

- (void)viewDidLoad
{
    [super viewDidLoad];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
}

- (IBAction)goButtonTouched:(id)sender {
    NSString *req = [NSString stringWithFormat:@"/program/run/noise/%i/%i/%i/%i", [self.changeIntervalTextField.text intValue], (int)self.redSlider.value, (int)self.greenSlider.value, (int)self.blueSlider.value];
    [[SWLEDController instance] sendRESTCommand:@"/program/stop"];
    [[SWLEDController instance] sendRESTCommand:req];
}

- (IBAction)stopButtonTouched:(id)sender {
    [[SWLEDController instance] sendRESTCommand:@"/program/stop"];
}

- (IBAction)allOffButtonTouched:(id)sender {
    [[SWLEDController instance] setAllOff];
    [[SWLEDController instance] latch];
}

@end
