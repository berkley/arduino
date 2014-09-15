//
//  SWHeartbeatViewController.m
//  LEDControl
//
//  Created by Chad Berkley on 8/13/14.
//  Copyright (c) 2014 Chad Berkley. All rights reserved.
//

#import "SWHeartbeatViewController.h"
#import "SWLEDController.h"

@interface SWHeartbeatViewController ()

@end

@implementation SWHeartbeatViewController

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
    NSString *req = [NSString stringWithFormat:@"/program/run/heartbeat/%i/%i/%i", (int)self.redSlider.value, (int)self.greenSlider.value, (int)self.blueSlider.value];
    [[SWLEDController instance] sendRESTCommand:@"/program/stop"];
    [[SWLEDController instance] sendRESTCommand:req];
}

- (IBAction)stopButtonTouched:(id)sender {
    [[SWLEDController instance] sendRESTCommand:@"/program/stop"];
}

- (IBAction)allOffButtonTouche:(id)sender {
    [[SWLEDController instance] setAllOff];
    [[SWLEDController instance] latch];
}

@end
