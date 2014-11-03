//
//  SWSettingViewController.m
//  LEDControl
//
//  Created by Chad Berkley on 8/21/14.
//  Copyright (c) 2014 Chad Berkley. All rights reserved.
//

#import "SWSettingViewController.h"

@interface SWSettingViewController ()

@end

@implementation SWSettingViewController

- (void)viewDidLoad
{
    [super viewDidLoad];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
}

- (void)viewWillAppear:(BOOL)animated
{
    [super viewWillAppear:animated];
    NSString *ip = [[NSUserDefaults standardUserDefaults] objectForKey:IP_ADDRESS];
    if(ip == nil)
    {
        ip = @"192.168.11.30";
        [[NSUserDefaults standardUserDefaults] setObject:ip forKey:IP_ADDRESS];
    }
    self.ipAddressTextField.text = ip;
}

- (IBAction)doneButtonTouched:(id)sender {
    [[NSUserDefaults standardUserDefaults] setObject:self.ipAddressTextField.text forKey:IP_ADDRESS];
    
    [self dismissViewControllerAnimated:YES completion:nil];
    [[SWLEDController instance] updateIp];
    [[SWFireController instance] updateIp];
}

@end
