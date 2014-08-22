//
//  SWScrollingTextCSViewController.m
//  LEDControl
//
//  Created by P. Mark Anderson on 8/21/14.
//  Copyright (c) 2014 Chad Berkley. All rights reserved.
//

#import "SWScrollingTextCSViewController.h"

@interface SWScrollingTextCSViewController ()
{
    CGFloat _xText;
}
@end

@implementation SWScrollingTextCSViewController

- (void)viewDidLoad
{
    [super viewDidLoad];
 
    self.textField = [[UITextField alloc] init];
    self.textField.text = @"Cosmic Giggle";
    self.textField.font = [UIFont systemFontOfSize:128];
    self.textField.textColor = [UIColor whiteColor];
    [self.textField sizeToFit];
    
    CGRect f = self.textField.frame;
    _xText = f.origin.x = self.streamedContentArea.frame.size.width;
    f.origin.y = (self.streamedContentArea.frame.size.height - f.size.height) / 2;
    self.textField.frame = f;

    [self addContentView:self.textField];
    [self animate];
}

- (void)animate {
    CGRect f = self.textField.frame;
    CGFloat w = f.size.width;

    if (_xText < -w) {
        _xText = self.streamedContentArea.frame.size.width;
    }

    CGFloat delaySec = 1.0/24.0;
    _xText -= delaySec * 200;

    f.origin.x = _xText;
    self.textField.frame = f;
    
    [self performSelector:@selector(animate) withObject:nil afterDelay:delaySec];
}

- (IBAction)closeButtonWasTapped:(id)sender {
    [self dismissViewControllerAnimated:YES completion:nil];
}

@end
