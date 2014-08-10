//
//  SWSlideshowCSViewController.m
//  LEDControl
//
//  Created by P. Mark Anderson on 8/9/14.
//  Copyright (c) 2014 Chad Berkley. All rights reserved.
//

#import "SWSlideshowCSViewController.h"

@interface SWSlideshowCSViewController ()
{
    UIImageView *_iv;
    CGFloat _scale;
    CGFloat _scaleDirection;
    CGFloat _angle;
}
@end

@implementation SWSlideshowCSViewController

- (void)viewDidLoad
{
    [super viewDidLoad];
    
    _scale = 1.0;
    _scaleDirection = 1.0;
    _iv = [[UIImageView alloc] initWithImage:[UIImage imageNamed:@"gradient.png"]];
    [self addContentView:_iv];
    
    [self animate];
}

- (void)animate {
    if (_scale > 1.0 || _scale < 0.1) {
        _scaleDirection *= -1;
    }
    _scale += (0.0025 * _scaleDirection);
    _angle += M_PI / 200;
    _iv.transform = CGAffineTransformConcat(CGAffineTransformMakeScale(_scale, _scale),
                                            CGAffineTransformMakeRotation(_angle));
    [self performSelector:@selector(animate) withObject:nil afterDelay:1/24];
}

@end
