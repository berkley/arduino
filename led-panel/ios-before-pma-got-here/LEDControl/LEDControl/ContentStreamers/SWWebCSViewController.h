//
//  SWWebCSViewController.h
//  LEDControl
//
//  Created by P. Mark Anderson on 8/20/14.
//  Copyright (c) 2014 Chad Berkley. All rights reserved.
//

#import "SWContentStreamViewController.h"

@interface SWWebCSViewController : SWContentStreamViewController <UIWebViewDelegate>

@property (nonatomic, strong) UIWebView *webView;
@property (weak, nonatomic) IBOutlet UIButton *closeButton;
@property (weak, nonatomic) IBOutlet UIButton *moreButton;
@property (strong, nonatomic) NSString *thingName;

- (IBAction)moreButtonWasTapped:(id)sender;
- (IBAction)closeButtonWasTapped:(id)sender;

@end
