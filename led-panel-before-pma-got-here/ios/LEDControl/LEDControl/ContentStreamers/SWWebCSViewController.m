//
//  SWWebCSViewController.m
//  LEDControl
//
//  Created by P. Mark Anderson on 8/20/14.
//  Copyright (c) 2014 Chad Berkley. All rights reserved.
//

#import "SWWebCSViewController.h"

@interface SWWebCSViewController ()

@end

@implementation SWWebCSViewController


///////////////

- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender
{
    NSString *thingName = [[segue.identifier componentsSeparatedByString:@"Segue"] objectAtIndex:0];
    
    NSArray *names = @[@"Rings",
                       @"Bubbles",
                       @"Spiral",
                       @"Worm",
                       @"Icosahedron",
                       @"Sphere",
                       @"Clock",
                       @"Countdown"
                       ];
    
    // parse name from segue
    if ([thingName isEqualToString:@"Shuffle"]) {
        NSInteger index = arc4rand() % [names count];
        thingName = [names objectAtIndex:index];
    }
    
    SWWebCSViewController *cs = (SWWebCSViewController*)segue.destinationViewController;
    cs.name = thingName;
}


/////////////


- (void)viewDidLoad
{
    [super viewDidLoad];

    self.webView = [[UIWebView alloc] initWithFrame:self.streamedContentArea.bounds];
    CGRect f = self.webView.frame;
//    f.origin.x = -f.size.width / 2;
    self.webView.frame = f;
    [self addContentView:self.webView];
    
    // omg particles 2
//    [self.webView loadRequest:[NSURLRequest requestWithURL:[NSURL URLWithString:@"http://bl.ocks.org/mbostock/raw/9539958/"]]];
    
    self.webView.delegate = self;
    
    // clock
    [self.webView loadRequest:[NSURLRequest requestWithURL:[NSURL URLWithString:@"http://bl.ocks.org/mbostock/raw/10685278/"]]];

    // gears
    [self.webView loadRequest:[NSURLRequest requestWithURL:[NSURL URLWithString:@"http://bl.ocks.org/mbostock/raw/10395901/"]]];
    
    // hexbins
    [self.webView loadRequest:[NSURLRequest requestWithURL:[NSURL URLWithString:@"http://bl.ocks.org/mbostock/raw/7833311/"]]];
    
    
    
    [self.webView loadRequest:[NSURLRequest requestWithURL:[NSURL URLWithString:@"http://bl.ocks.org/pmark/raw/8044832/"]]];
    

}

- (void)webViewDidFinishLoad:(UIWebView *)webView {
    [self performSelector:@selector(onLoad) withObject:nil afterDelay:0.75];
}

- (void)onLoad {
    
//    NSString *js = @"var meta = document.createElement('meta'); meta.name='viewport'; meta.content='user-scalable=0; width=320'; document.getElementsByTagName('head')[0].appendChild(meta);";
//
//    NSString *js = @"$('head').append('<meta name='viewport' content='width=device-width; initial-scale=1.0; maximum-scale=1.0; user-scalable=0;'>');";
//    
//    [self.webView stringByEvaluatingJavaScriptFromString:js];
    
}

- (IBAction)moreButtonWasTapped:(id)sender {
}

- (IBAction)closeButtonWasTapped:(id)sender {
    self.closing = YES;
    [self dismissViewControllerAnimated:YES completion:nil];
}

- (void)viewWillDisappear:(BOOL)animated
{
    [super viewWillDisappear:animated];
}

@end
