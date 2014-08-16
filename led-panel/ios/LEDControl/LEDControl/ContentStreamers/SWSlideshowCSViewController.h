//
//  SWSlideshowCSViewController.h
//  LEDControl
//
//  Created by P. Mark Anderson on 8/9/14.
//  Copyright (c) 2014 Chad Berkley. All rights reserved.
//

#import "SWContentStreamViewController.h"
#import "JBKenBurnsView.h"

@interface SWSlideshowCSViewController : SWContentStreamViewController <KenBurnsViewDelegate>

@property (nonatomic, strong) JBKenBurnsView *kenView;
@property (weak, nonatomic) IBOutlet UIButton *closeButton;
@property (weak, nonatomic) IBOutlet UIButton *moreButton;

- (IBAction)closeButtonWasTapped:(id)sender;
- (IBAction)moreButtonWasTapped:(id)sender;

@end
