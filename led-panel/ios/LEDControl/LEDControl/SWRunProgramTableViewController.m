//
//  SWRunProgramTableViewController.m
//  LEDControl
//
//  Created by Chad Berkley on 7/31/14.
//  Copyright (c) 2014 Chad Berkley. All rights reserved.
//

#import "SWRunProgramTableViewController.h"

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
    
}

@end
