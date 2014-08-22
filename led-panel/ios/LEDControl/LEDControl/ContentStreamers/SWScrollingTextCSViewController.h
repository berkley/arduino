//
//  SWScrollingTextCSViewController.h
//  LEDControl
//
//  Created by P. Mark Anderson on 8/21/14.
//  Copyright (c) 2014 Chad Berkley. All rights reserved.
//

#import "SWContentStreamViewController.h"

@interface SWScrollingTextCSViewController : SWContentStreamViewController

@property (weak, nonatomic) IBOutlet UIButton *closeButton;
@property (weak, nonatomic) IBOutlet UIButton *moreButton;
@property (strong, nonatomic) UITextField *textField;

- (IBAction)closeButtonWasTapped:(id)sender;
@property (weak, nonatomic) IBOutlet UIButton *moreButtonWasTapped;
@end
