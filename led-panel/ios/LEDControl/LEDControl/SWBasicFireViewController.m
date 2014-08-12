//
//  SWBasicFireViewController.m
//  LEDControl
//
//  Created by Chad Berkley on 7/26/14.
//  Copyright (c) 2014 Chad Berkley. All rights reserved.
//

#import "SWBasicFireViewController.h"
#import "SWFireController.h"

@interface SWBasicFireViewController ()

@end

@implementation SWBasicFireViewController


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

- (void)viewDidAppear:(BOOL)animated
{
    [self updateRandomPuffText];
}

- (void)updateRandomPuffText
{
    if([SWFireController instance].randomPuffs)
    {
        self.randomPuffsButton.titleLabel.text = @"Random Puffs Off";
    }
    else
    {
        self.randomPuffsButton.titleLabel.text = @"Random Puffs On";
    }
}

#pragma mark - selectors

- (IBAction)fire1ButtonTouched:(id)sender {
    [[SWFireController instance] puff1];
}

- (IBAction)fire2ButtonTouched:(id)sender {
    [[SWFireController instance] puff2];
}

- (IBAction)fire3ButtonTouched:(id)sender {
    [[SWFireController instance] puff3];
}

- (IBAction)seq123ButtonTouched:(id)sender {
    [[SWFireController instance] seq123];
}

- (IBAction)seq321ButtonTouched:(id)sender {
    [[SWFireController instance] seq321];
}

- (IBAction)seqAllButtonTouched:(id)sender {
    [[SWFireController instance] seqAll];
}

- (IBAction)randomPuffsButtonTouhed:(id)sender
{
    [[SWFireController instance] toggleRandomPuffs];
    [self performSelectorOnMainThread:@selector(updateRandomPuffText) withObject:nil waitUntilDone:NO];
}

@end
