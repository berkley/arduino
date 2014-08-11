//
//  SWRunProgramTableViewController.m
//  LEDControl
//
//  Created by Chad Berkley on 7/31/14.
//  Copyright (c) 2014 Chad Berkley. All rights reserved.
//

#import "SWRunProgramTableViewController.h"
#import "SWLEDController.h"

@interface SWRunProgramTableViewController ()

@end

@implementation SWRunProgramTableViewController

- (void)viewDidLoad
{
    [super viewDidLoad];
}

- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
}

- (void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    UITableViewCell *cell = [self.tableView cellForRowAtIndexPath:indexPath];
    NSLog(@"cell name: %@", cell.textLabel.text);
    if([cell.textLabel.text isEqualToString:@"Stop All"])
    {
        [[SWLEDController instance] sendRESTCommand:@"/program/stop"];
    }
    else if([cell.textLabel.text isEqualToString:@"SVG Beat Matched Cubes"])
    {
        [[SWLEDController instance] sendRESTCommand:@"/program/stop/all"];
        [[SWLEDController instance] sendRESTCommand:[NSString stringWithFormat:@"/program/run/browser/audio-sample"]];
    }
    else if([cell.textLabel.text isEqualToString:@"Spotlight"])
    {
        [[SWLEDController instance] sendRESTCommand:@"/program/stop"];
        [[SWLEDController instance] sendRESTCommand:[NSString stringWithFormat:@"/program/run/browser/sample"]];
    }
    else
    {
        [[SWLEDController instance] sendRESTCommand:@"/program/stop"];
        [[SWLEDController instance] sendRESTCommand:[NSString stringWithFormat:@"/program/run/%@", cell.textLabel.text]];
    }
}

@end
