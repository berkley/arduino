//
//  SWStaticViewController.m
//  LEDControl
//
//  Created by Chad Berkley on 8/13/14.
//  Copyright (c) 2014 Chad Berkley. All rights reserved.
//

#import "SWStaticViewController.h"
#import "SWLEDController.h"

@interface SWStaticViewController ()

@end

@implementation SWStaticViewController

- (id)initWithNibName:(NSString *)nibNameOrNil bundle:(NSBundle *)nibBundleOrNil
{
    self = [super initWithNibName:nibNameOrNil bundle:nibBundleOrNil];
    if (self) {
        // Custom initialization
    }
    return self;
}

- (void)viewDidLoad
{
    [super viewDidLoad];
	// Do any additional setup after loading the view.
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}

- (IBAction)goButtonTouched:(id)sender {
    NSString *req = [NSString stringWithFormat:@"/program/run/static/%i/%i/%i/%i", [self.changeIntervalTextField.text intValue], (int)self.redSlider.value, (int)self.greenSlider.value, (int)self.blueSlider.value];
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
