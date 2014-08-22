//
//  SWScrollingTextCSViewController.h
//  LEDControl
//
//  Created by P. Mark Anderson on 8/21/14.
//  Copyright (c) 2014 Chad Berkley. All rights reserved.
//

#import "SWContentStreamViewController.h"

@interface SWScrollingTextCSViewController : SWContentStreamViewController <UITextFieldDelegate>

@property (weak, nonatomic) IBOutlet UIButton *closeButton;
@property (weak, nonatomic) IBOutlet UIButton *moreButton;
@property (strong, nonatomic) UITextField *textField;
@property (strong, nonatomic) UITextField *textField2;
@property (weak, nonatomic) IBOutlet UITextField *textEntryField;

- (IBAction)closeButtonWasTapped:(id)sender;
- (IBAction)moreButtonWasTapped:(id)sender;

@end
