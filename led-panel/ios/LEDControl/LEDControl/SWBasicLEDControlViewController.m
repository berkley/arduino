//
//  SWBasicLEDControlViewController.m
//  LEDControl
//
//  Created by Chad Berkley on 7/24/14.
//  Copyright (c) 2014 Chad Berkley. All rights reserved.
//

#import "SWBasicLEDControlViewController.h"
#import "SWLEDController.h"

@interface SWBasicLEDControlViewController ()

@end

@implementation SWBasicLEDControlViewController

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

- (void)setPanel:(NSInteger) panel
{
    SWLEDController *controller = [SWLEDController instance];
    NSInteger r = (NSInteger)self.redSlider.value;
    NSInteger g = (NSInteger)self.greenSlider.value;
    NSInteger b = (NSInteger)self.blueSlider.value;
    NSLog(@"r: %i g: %i b: %i", r, g, b);
    if(panel == 99)
    {
        [controller setScreen:0 red:r green:g blue:b];
        [controller setScreen:1 red:r green:g blue:b];
        [controller setScreen:2 red:r green:g blue:b];
    }
    else if(panel == 100)
    {
        [controller setAllOff];
    }
    else
    {
        [controller setScreen:panel - 1 red:r green:g blue:b];
    }
    [controller latch];
}

- (IBAction)setPanelOneButtonTouched:(id)sender
{
    [self setPanel:1];
}

- (IBAction)setPanelTwoButtonTouched:(id)sender
{
    [self setPanel:2];
}

- (IBAction)setPanelThreeButtonTouched:(id)sender
{
    [self setPanel:3];
}

- (IBAction)setAllButtonTouched:(id)sender
{
    [self setPanel:99];
}

- (IBAction)allOffButtonTouched:(id)sender
{
    [self setPanel:100];
}


@end
