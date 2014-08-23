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

- (void)viewDidLoad
{
    [super viewDidLoad];

    self.webView = [[UIWebView alloc] initWithFrame:self.streamedContentArea.bounds];
    self.webView.delegate = self;
    CGRect f = self.webView.frame;
//    f.origin.x = -f.size.width / 2;
    self.webView.frame = f;
    [self addContentView:self.webView];
    
    
}

- (void)webViewDidFinishLoad:(UIWebView *)webView {
    NSLog(@"webview did finish load");
//    [self performSelector:@selector(onLoad) withObject:nil afterDelay:0.75];
}

- (void)webViewDidStartLoad:(UIWebView *)webView {
    NSLog(@"webview did start load");
}

- (void)webView:(UIWebView *)webView didFailLoadWithError:(NSError *)error {
    NSLog(@"webview fail: %@", error);
}

- (void)viewDidAppear:(BOOL)animated {
    [super viewDidAppear:animated];
    [self loadStuff];
}

- (void)loadStuff {
    // omg particles 2
    [self.webView loadRequest:[NSURLRequest requestWithURL:[NSURL URLWithString:@"http://bl.ocks.org/mbostock/raw/9539958/"]]];
    
    // clock
//    [self.webView loadRequest:[NSURLRequest requestWithURL:[NSURL URLWithString:@"http://bl.ocks.org/mbostock/raw/10685278/"]]];
    
    // gears
    //    [self.webView loadRequest:[NSURLRequest requestWithURL:[NSURL URLWithString:@"http://bl.ocks.org/mbostock/raw/10395901/"]]];
    
    // hexbins
//    [self.webView loadRequest:[NSURLRequest requestWithURL:[NSURL URLWithString:@"http://bl.ocks.org/mbostock/raw/7833311/"]]];
    
    
    
    // pma bubbles
    //    [self.webView loadRequest:[NSURLRequest requestWithURL:[NSURL URLWithString:@"http://bl.ocks.org/pmark/raw/8044832/"]]];
    
    
    // countdown
    // http://bl.ocks.org/mbostock/9843633
    
    
    // rotating icosahedron
    //    http://bl.ocks.org/mbostock/raw/7782500/
    
    
    // spiraly particles
    // http://bl.ocks.org/pmark/raw/7916621/
    
    
    // geodesic rainbow
    // http://bl.ocks.org/mbostock/raw/3057239/
    
    // geodesic grid
    // http://bl.ocks.org/mbostock/raw/3058685/
    
    // icosahedron
    // http://bl.ocks.org/mbostock/raw/3061181/
    
    // one-way markers
    // http://bl.ocks.org/mbostock/raw/4965670/
    
    // rotating voronoi
    // http://bl.ocks.org/mbostock/raw/4636377/
    
    
    // rainbow worm
    // http://bl.ocks.org/mbostock/raw/4165404/
    
    // orthographic shading
    // http://bl.ocks.org/mbostock/raw/3031319/
    
    // spermatazoa
    // http://bl.ocks.org/mbostock/raw/1136236/
    
    // polar clock
    // http://bl.ocks.org/mbostock/raw/1096355/
    
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
