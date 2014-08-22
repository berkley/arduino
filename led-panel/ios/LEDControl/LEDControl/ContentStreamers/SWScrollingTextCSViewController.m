//
//  SWScrollingTextCSViewController.m
//  LEDControl
//
//  Created by P. Mark Anderson on 8/21/14.
//  Copyright (c) 2014 Chad Berkley. All rights reserved.
//

#import "SWScrollingTextCSViewController.h"

#define THROB_SCALE_DELTA 0.00075
#define THROB_SCALE_MAX 1.5
#define THROB_SCALE_MIN 0.75

#define SCROLL_TEXT_KEY @"SCROLL_TEXT_KEY"

@interface SWScrollingTextCSViewController ()
{
    CGFloat _xText;
    CGFloat _throbScale;
    CGFloat _throbDirection;
}
@end

@implementation SWScrollingTextCSViewController

- (void)viewDidLoad
{
    [super viewDidLoad];
 
    self.textField = [[UITextField alloc] init];
    self.textField2 = [[UITextField alloc] init];
    self.textField.font = self.textField2.font = [UIFont systemFontOfSize:180];
    self.textField.textColor = [UIColor whiteColor];
    self.textField2.textColor = [UIColor colorWithRed:0 green:1.0 blue:1.0 alpha:0.33];
    
    _xText = self.streamedContentArea.frame.size.width;
    _throbScale = 1.0;
    _throbDirection = 1.0;

    [self addContentView:self.textField2];
    [self addContentView:self.textField];
    
    NSString *text = [[NSUserDefaults standardUserDefaults] objectForKey:SCROLL_TEXT_KEY];
    if ([text length] == 0) {
        text = @"Giggle on!";
    }
    
    self.textEntryField.text = text;

    [self setText:text];
    [self animate];
}

- (void)setText:(NSString*)text {
    self.textField.text = self.textField2.text = text;
    [self.textField sizeToFit];
    [self.textField2 sizeToFit];
    
    CGFloat vh = self.streamedContentArea.frame.size.height;
    CGRect f = self.textField.frame;
    CGFloat yMid = (vh - f.size.height) / 2;
    f.origin.y = yMid - (vh * 0.15);
    self.textField.frame = f;

    f.origin.y = yMid + (vh * 0.15);
    self.textField2.frame = f;
    
    [[NSUserDefaults standardUserDefaults] setObject:text forKey:SCROLL_TEXT_KEY];
}

- (void)animate {
    CGRect f = self.textField.frame;
    CGFloat w = f.size.width;
    CGFloat rightEdge = self.streamedContentArea.frame.size.width;

    if (_xText < -w) {
        _xText = rightEdge;
    }

    CGFloat delaySec = 1.0/60.0;
    _xText -= delaySec * 150;

    _throbScale += (THROB_SCALE_DELTA * _throbDirection);
    if (_throbScale >= THROB_SCALE_MAX || _throbScale < THROB_SCALE_MIN) {
        _throbDirection *= -1;
    }

    f.origin.x = _xText;
    self.textField.frame = f;

    f = self.textField2.frame;
    f.origin.x =  (rightEdge - _xText) - f.size.width;
    self.textField2.frame = f;

    self.textField.transform = CGAffineTransformMakeScale(_throbScale, _throbScale);
    self.textField2.transform = CGAffineTransformMakeScale(_throbScale*0.75, _throbScale*0.75);
    
    [self performSelector:@selector(animate) withObject:nil afterDelay:delaySec];
}

- (IBAction)closeButtonWasTapped:(id)sender {
    self.closing = YES;

    [self dismissViewControllerAnimated:YES completion:nil];
}

- (IBAction)moreButtonWasTapped:(id)sender {
    
}

- (BOOL)textFieldShouldReturn:(UITextField *)textField {
    [self setText:textField.text];
    [textField resignFirstResponder];
    return YES;
}


@end
