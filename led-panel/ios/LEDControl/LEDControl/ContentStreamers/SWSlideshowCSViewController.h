//
//  SWSlideshowCSViewController.h
//  LEDControl
//
//  Created by P. Mark Anderson on 8/9/14.
//  Copyright (c) 2014 Chad Berkley. All rights reserved.
//

#import "SWContentStreamViewController.h"

@interface SWSlideshowCSViewController : SWContentStreamViewController

@property (weak, nonatomic) IBOutlet UIButton *closeButton;

- (IBAction)closeButtonWasTapped:(id)sender;

@end
